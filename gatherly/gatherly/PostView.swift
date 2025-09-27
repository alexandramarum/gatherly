import SwiftUI
import PhotosUI

struct EventPostView: View {
    @State private var title = "New Event"
    @State private var description = "This is a new event"
    @State private var location = "Chapel Hill"
    @State private var timestamp = "2025-09-26T21:45:00Z"
    @State private var creatorPid = "73056472"

    @State private var selectedItem: PhotosPickerItem? = nil
    @State private var selectedImage: UIImage? = nil
    @State private var isSubmitting = false
    @State private var showAlert = false
    @State private var alertMessage = ""

    var body: some View {
        Form {
            TextField("Title", text: $title)
            TextField("Description", text: $description)
            TextField("Location", text: $location)
            TextField("Timestamp (ISO8601)", text: $timestamp)
            TextField("Creator PID", text: $creatorPid)

            PhotosPicker(selection: $selectedItem, matching: .images) {
                if let image = selectedImage {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 150)
                } else {
                    Label("Select Photo", systemImage: "photo")
                }
            }
            .onChange(of: selectedItem) { newItem in
                Task {
                    if let data = try? await newItem?.loadTransferable(type: Data.self),
                       let uiImage = UIImage(data: data) {
                        selectedImage = uiImage
                    }
                }
            }

            Button("Create Event") {
                Task { await createEvent() }
            }
            .disabled(isSubmitting)
        }
        .alert(alertMessage, isPresented: $showAlert) { Button("OK", role: .cancel) {} }
        .navigationTitle("New Event")
    }

    private func createEvent() async {
        guard !title.isEmpty, !description.isEmpty, !location.isEmpty,
              !timestamp.isEmpty, !creatorPid.isEmpty else {
            alertMessage = "All text fields are required"
            showAlert = true
            return
        }

        isSubmitting = true
        do {
            let _ = try await EventService.createEvent(
                creatorPid: creatorPid,
                timestamp: timestamp,
                description: description,
                location: location,
                title: title,
                image: selectedImage)
        } catch {
            if let urlError = error as? URLError {
                print("URLError code:", urlError.code.rawValue)
                print("Description:", urlError.localizedDescription)
            } else {
                print(error)
            }
        }
        isSubmitting = false
    }
}

#Preview {
    EventPostView()
}
