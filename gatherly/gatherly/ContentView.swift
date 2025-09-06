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

    let service = GatherlyService()
    
    var body: some View {
        VStack {
            if let selectionData,
               let uiImage = UIImage(data: selectionData) {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
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
                    let success = await service.upload(eventId: "12345", imageData: data)
                    isUploading = false
                    uploadResult = success ? "✅ Upload successful" : "❌ Upload failed"
                }
            }
            .disabled(selectionData == nil || isUploading)
            .padding()
            
            if let uploadResult {
                Text(uploadResult)
                    .foregroundColor(uploadResult.contains("✅") ? .green : .red)
            }
        }
        .onChange(of: selection) { item in
            Task {
                if let data = try? await item?.loadTransferable(type: Data.self) {
                    selectionData = data
                }
            }
        }
    }
}

class GatherlyService {
    let base: URL = URL(string: "https://gatherly-backend-q9vm.onrender.com/")!
    
    func upload(eventId: String, imageData: Data) async -> Bool {
        let path = base.appendingPathComponent("images/\(eventId)")
        var request = URLRequest(url: path)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let base64String = imageData.base64EncodedString()
        let dataURI = "data:image/png;base64,\(base64String)"
        let body: [String: String] = ["image": dataURI]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
            let (data, response) = try await URLSession.shared.data(for: request)
            
            if let httpResponse = response as? HTTPURLResponse {
                print("Status:", httpResponse.statusCode)
                print("Response body:", String(data: data, encoding: .utf8) ?? "none")
                return httpResponse.statusCode == 200
            }
        } catch {
            print("Upload error:", error)
        }
        
        return false
    }
}


#Preview {
    ContentView()
}
