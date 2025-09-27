import SwiftUI

struct ContentView: View {
    @State private var events: [Event] = []
    @State private var isLoading = true
    @State private var errorMsg: String?

    var body: some View {
        NavigationStack {
            List(events) { event in
                VStack(alignment: .leading, spacing: 6) {
                    Text(event.title).font(.headline)
                    Text(event.description).font(.subheadline)
                    Text("Location: \(event.location)")
                    if let urlString = event.image_url,
                       let url = URL(string: urlString) {
                        AsyncImage(url: url) { image in
                            image.resizable()
                                .scaledToFill()
                                .frame(height: 150)
                                .clipped()
                        } placeholder: {
                            ProgressView()
                        }
                    }
                }
            }
            .navigationTitle("Events")
            .task {
                do {
                    events = try await EventService.fetchEvents()
                } catch {
                    errorMsg = error.localizedDescription
                }
                isLoading = false
            }
            .overlay {
                if isLoading { ProgressView() }
                if let msg = errorMsg { Text("Error: \(msg)") }
            }
        }
    }
}

#Preview {
    ContentView()
}
