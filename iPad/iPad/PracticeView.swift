//
//  PracticeView.swift
//  iPad
//
//  Created by Ben Klosky on 10/22/25.
//

import SwiftUI

struct PracticeView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Image(systemName: "target")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Practice")
            }
            .padding()
            .navigationTitle("Practice")
        }
    }
}


