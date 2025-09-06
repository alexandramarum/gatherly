//
//  ContentView.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/20/25.
//

import SwiftUI
import PhotosUI

struct ContentView: View {
    @State private var selection: PhotosPickerItem?
    @State private var selectionData: Data?
    @State private var isUploading = false
    @State private var uploadResult: String?
    @State private var fetchedImageURL: String?
    @State private var deleteResult: String?

    let service = ImageService()
    let eventId = "123456" // Example event ID
    
    var body: some View {
        VStack(spacing: 20) {
            if let selectionData,
               let uiImage = UIImage(data: selectionData) {
                Text("Selected image")
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
            } else if let urlString = fetchedImageURL,
                      let url = URL(string: urlString) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        Text("Fetched image")
                        image.resizable()
                            .scaledToFit()
                            .frame(height: 200)
                    case .failure(_):
                        Text("Failed to load image")
                    case .empty:
                        ProgressView()
                    @unknown default:
                        EmptyView()
                    }
                }
            } else {
                Text("No photo selected")
                    .foregroundColor(.gray)
            }
            
            PhotosPicker(
                selection: $selection,
                photoLibrary: .shared()
            ) {
                Text("Select a photo")
            }
            
            Button("Upload") {
                Task {
                    guard let data = selectionData else { return }
                    isUploading = true
                    let success = await service.upload(eventId: eventId, imageData: data)
                    isUploading = false
                    uploadResult = success ? "✅ Upload successful" : "❌ Upload failed"
                }
            }
            .disabled(selectionData == nil || isUploading)
            
            if let uploadResult {
                Text(uploadResult)
                    .foregroundColor(uploadResult.contains("✅") ? .green : .red)
            }
            
            Divider()
                .padding()
            
            Button("Fetch") {
                Task {
                    if let url = await service.fetch(eventId: eventId) {
                        selectionData = nil
                        fetchedImageURL = url
                        print(fetchedImageURL)
                    }
                }
            }
            
            // Delete button
            Button("Delete") {
                Task {
                    let success = await service.delete(eventId: eventId)
                    deleteResult = success ? "✅ Deleted successfully" : "❌ Delete failed"
                    if success { fetchedImageURL = nil; selectionData = nil }
                }
            }
            
            if let deleteResult {
                Text(deleteResult)
                    .foregroundColor(deleteResult.contains("✅") ? .green : .red)
            }
        }
        .padding()
        .onChange(of: selection) { item in
            Task {
                if let data = try? await item?.loadTransferable(type: Data.self) {
                    selectionData = data
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
