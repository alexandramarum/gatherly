//
//  ImageService.swift
//  gatherly
//
//  Created by Alexandra Marum on 9/5/25.
//

import Foundation

class ImageService {
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
            let (_, response) = try await URLSession.shared.data(for: request)
            if let httpResponse = response as? HTTPURLResponse {
                return httpResponse.statusCode == 200
            }
        } catch {
            print("Upload error:", error)
        }
        return false
    }
    
    func fetch(eventId: String) async -> String? {
        let path = base.appendingPathComponent("images/\(eventId)")
        var request = URLRequest(url: path)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let result = try JSONDecoder().decode(FetchResponse.self, from: data)
            return result.data.secureUrl
        } catch {
            print("Fetch error:", error)
        }
        return nil
    }
    
    func delete(eventId: String) async -> Bool {
        let path = base.appendingPathComponent("images/\(eventId)")
        var request = URLRequest(url: path)
        request.httpMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            if let httpResponse = response as? HTTPURLResponse {
                return httpResponse.statusCode == 200
            }
        } catch {
            print("Delete error:", error)
        }
        return false
    }
}

struct FetchResponse: Codable {
    let data: FetchData
}

struct FetchData: Codable {
    let publicId: String
    let secureUrl: String
    
    enum CodingKeys: String, CodingKey {
        case publicId = "public_id"
        case secureUrl = "secure_url"
    }
}
