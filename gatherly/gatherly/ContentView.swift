//
//  ContentView.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/20/25.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        switch AuthenticationService.shared.state {
        case .authenticated:
            EventsView()
        case .unauthenticated:
            AuthenticationView()
        }
    }
}

#Preview {
    ContentView()
        .preferredColorScheme(.dark)
}
