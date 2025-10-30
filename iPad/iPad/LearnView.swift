//
//  LearnView.swift
//  iPad
//
//  Created by Ben Klosky on 10/22/25.
//

import SwiftUI

struct LearnView: View {
    private let firstName: String = "Ben"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Greeting
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Hi, \(firstName)")
                            .font(.largeTitle.bold())
                            .foregroundStyle(.primary)
                        Text("Ready to solve some problems?")
                            .font(.title3)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    // Continue section
                    OverviewCard(icon: "function",
                                 title: "Continue where you left off",
                                 subtitle: "Chapter 3 • Linear Equations",
                                 tint: .blue) {
                        Button(action: {}) {
                            Label("Solve Problems", systemImage: "arrow.forward.circle.fill")
                        }
                        .buttonStyle(.borderedProminent)
                    }

                    // Recommendations
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Recommended for you")
                            .font(.headline)
                            .foregroundStyle(.primary)
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                RecommendationTile(title: "Multiplication Drills", subtitle: "10 min", symbol: "multiply.circle.fill", tint: .teal)
                                RecommendationTile(title: "Geometry Practice", subtitle: "8 min", symbol: "triangle.fill", tint: .orange)
                                RecommendationTile(title: "Problem Set", subtitle: "5 min", symbol: "lightbulb.fill", tint: .purple)
                            }
                            .padding(.horizontal, 2)
                        }
                    }

                    // Progress
                    OverviewCard(icon: "chart.bar.fill",
                                 title: "Weekly progress",
                                 subtitle: "4 problem sets • 38 min total",
                                 tint: .green) {
                        HStack(spacing: 16) {
                            ProgressBar(value: 0.6, label: "Mon")
                            ProgressBar(value: 0.8, label: "Tue")
                            ProgressBar(value: 0.2, label: "Wed")
                            ProgressBar(value: 0.0, label: "Thu")
                            ProgressBar(value: 0.9, label: "Fri")
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 24)
            }
            .background(Color(.systemGroupedBackground))
            .toolbarTitleDisplayMode(.large)
        }
    }
}

private struct OverviewCard<Content: View>: View {
    let icon: String
    let title: String
    let subtitle: String
    let tint: Color
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: icon)
                    .font(.title2.weight(.semibold))
                    .foregroundStyle(.white)
                    .padding(10)
                    .background(tint.gradient, in: .circle)

                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .foregroundStyle(.primary)
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Spacer()
            }

            content
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(.background)
                .shadow(color: Color.primary.opacity(0.06), radius: 16, x: 0, y: 8)
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .strokeBorder(.quaternary, lineWidth: 0.5)
                )
        )
    }
}

private struct RecommendationTile: View {
    let title: String
    let subtitle: String
    let symbol: String
    let tint: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Image(systemName: symbol)
                .font(.title2)
                .foregroundStyle(.white)
                .padding(12)
                .background(tint.gradient, in: .circle)
            Text(title)
                .font(.headline)
                .foregroundStyle(.primary)
            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(16)
        .frame(width: 220, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(.background)
                .shadow(color: Color.primary.opacity(0.06), radius: 12, x: 0, y: 6)
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .strokeBorder(.quaternary, lineWidth: 0.5)
                )
        )
    }
}

private struct ProgressBar: View {
    let value: CGFloat
    let label: String

    var body: some View {
        VStack(spacing: 8) {
            GeometryReader { proxy in
                let height = proxy.size.height
                ZStack(alignment: .bottom) {
                    Capsule()
                        .fill(Color.secondary.opacity(0.15))
                    Capsule()
                        .fill(.green.gradient)
                        .frame(height: height * value)
                }
            }
            .frame(width: 16, height: 72)

            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}


