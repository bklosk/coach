//
//  ContentView.swift
//  iPad
//
//  Created by Ben Klosky on 10/21/25.
//

import SwiftUI

struct ContentView: View {
    @Environment(\.verticalSizeClass) private var verticalSizeClass
    @State private var selectedTab: Tab = .learn

    private enum Tab: Hashable {
        case canvas
        case learn
        case practice
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            CanvasView()
                .tag(Tab.canvas)
                .tabItem {
                    VStack(spacing: 2) {
                        Image(systemName: "pencil")
                        Text("Canvas")
                    }
                }

        
            LearnView()
                .tag(Tab.learn)
                .tabItem {
                    VStack(spacing: 2) {
                        Image(systemName: "book")
                        Text("Learn")
                    }
                }

            PracticeView()
                .tag(Tab.practice)
                .tabItem {
                    VStack(spacing: 2) {
                        Image(systemName: "dumbbell")
                        Text("Practice")
                    }
                }


        }
        .toolbar(.visible, for: .tabBar)
        // Force bottom tab bar in portrait by making size class compact only when portrait
        .environment(\.horizontalSizeClass, verticalSizeClass == .regular ? .compact : .regular)
    }
}


#Preview {
    ContentView()
}
