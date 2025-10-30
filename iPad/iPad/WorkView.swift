//
//  WorkView.swift
//  iPad
//
//  Created by Ben Klosky on 10/22/25.
//

import SwiftUI
import PencilKit
import UIKit

struct CanvasView: View {
    @StateObject private var session = RealtimeSessionManager()

    private var sessionButtonTitle: String {
        session.isStreaming ? "Stop Streaming" : "Start Streaming"
    }

    var body: some View {
        ZStack(alignment: .topTrailing) {
            CanvasViewRepresentable(manager: session)
                .ignoresSafeArea()

            Button(action: toggleStreaming) {
                Text(sessionButtonTitle)
            }
            .buttonStyle(.borderedProminent)
            .padding()
        }
    }

    private func toggleStreaming() {
        if session.isStreaming {
            session.stop()
        } else {
            session.start()
        }
    }
}

struct CanvasViewRepresentable: UIViewRepresentable {
    let manager: RealtimeSessionManager
    func makeUIView(context: Context) -> PKCanvasView {
        let canvasView = PKCanvasView()
        canvasView.backgroundColor = .systemBackground
        canvasView.drawing = PKDrawing()
        canvasView.drawingPolicy = .anyInput
        
        let toolPicker = PKToolPicker()
        toolPicker.setVisible(true, forFirstResponder: canvasView)
        toolPicker.addObserver(canvasView)
        canvasView.becomeFirstResponder()
        manager.bindCanvas(canvasView)
        
        return canvasView
    }
    
    func updateUIView(_ uiView: PKCanvasView, context: Context) {}
}

