//
//  RealtimeSessionManager.swift
//  iPad
//
//  Created by Assistant on 10/30/25.
//

import Foundation
import UIKit
import PencilKit
import Combine

final class RealtimeSessionManager: ObservableObject {
    @Published private(set) var isStreaming = false

    private var socket: URLSessionWebSocketTask?
    private var timer: Timer?
    private weak var canvas: PKCanvasView?

    private let model = "gpt-realtime"
    private let endpoint = URL(string: "wss://api.openai.com/v1/realtime")!
    private let apiKey: String

    init() {
        self.apiKey = (Bundle.main.object(forInfoDictionaryKey: "OPENAI_API_KEY") as? String) ?? ""
    }

    func bindCanvas(_ view: PKCanvasView) {
        self.canvas = view
    }

    func start() {
        guard !isStreaming else { return }
        guard !apiKey.isEmpty else {
            print("Missing OPENAI_API_KEY in Info.plist")
            return
        }

        var comps = URLComponents(url: endpoint, resolvingAgainstBaseURL: false)!
        comps.queryItems = [URLQueryItem(name: "model", value: model)]

        var req = URLRequest(url: comps.url!)
        req.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        let ws = URLSession(configuration: .default).webSocketTask(with: req)
        ws.resume()
        self.socket = ws
        self.isStreaming = true

        receiveLoop()

        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.sendCanvasFrame()
        }
    }

    func stop() {
        timer?.invalidate(); timer = nil
        socket?.cancel(with: .goingAway, reason: nil)
        socket = nil
        isStreaming = false
    }

    private func receiveLoop() {
        socket?.receive { [weak self] result in
            guard let self else { return }
            switch result {
            case .failure(let err):
                print("WS receive error:", err)
                self.stop()
            case .success(let msg):
                switch msg {
                case .string(let s): print("\u2190 \(s)")
                case .data(let d): print("\u2190 \(d.count) bytes")
                @unknown default: break
                }
                self.receiveLoop()
            }
        }
    }

    private func sendCanvasFrame() {
        guard let canvas = self.canvas else { return }

        let bounds = canvas.bounds
        let drawing = canvas.drawing

        Task.detached {
            let scale = UIScreen.main.scale
            let uiImage = drawing.image(from: bounds, scale: scale)
            guard let jpeg = uiImage.jpegData(compressionQuality: 0.7) else { return }
            let b64 = jpeg.base64EncodedString()
            let dataURL = "data:image/jpeg;base64,\(b64)"

            let item: [String: Any] = [
                "type": "conversation.item.create",
                "item": [
                    "type": "message",
                    "role": "user",
                    "content": [
                        [
                            "type": "input_text",
                            "text": "Explain the student’s canvas. Focus on math steps and issues."
                        ],
                        [
                            "type": "input_image",
                            "image_url": dataURL
                        ]
                    ]
                ]
            ]

            let respond: [String: Any] = ["type": "response.create"]

            await self.sendJSON(item)
            await self.sendJSON(respond)
        }
    }

    @MainActor
    private func sendJSON(_ obj: [String: Any]) async {
        guard let socket else { return }
        do {
            let data = try JSONSerialization.data(withJSONObject: obj, options: [])
            socket.send(.data(data)) { error in
                if let error { print("WS send error:", error) }
            }
        } catch {
            print("JSON encode error:", error)
        }
    }
}


