//
//  EventService.swift
//  gatherly
//

import Foundation
import UIKit

struct Event: Identifiable, Codable {
    let id: String
    let creatorPid: String
    let timestamp: String
    let description: String
    let location: String
    let title: String
    let image_url: String?
}

enum EventError: Error {
    case creationFailed
}

class EventService {
    static let baseURL = URL(string: "http://localhost:3000/events")!

    /// Creates an event, optionally with an image. Returns the created Event.
    static func createEvent(
        creatorPid: String,
        timestamp: String,
        description: String,
        location: String,
        title: String,
        image: UIImage? = nil
    ) async throws -> Event {

        // Prepare JSON body
        var bodyDict: [String: Any] = [
            "creatorPid": creatorPid,
            "timestamp": timestamp,
            "description": description,
            "location": location,
            "title": title
        ]

        if let img = image, let data = img.jpegData(compressionQuality: 0.8) {
            let base64 = data.base64EncodedString()
            bodyDict["image"] = "data:image/jpeg;base64,\(base64)"
        }

        var request = URLRequest(url: baseURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: bodyDict)

        print("🔹 Sending POST request to create event with body keys:", bodyDict.keys)
        if let img = image {
            print("🔹 Image included in request (size bytes):", img.jpegData(compressionQuality: 0.8)?.count ?? 0)
        }

        do {
            let (data, response) = try await URLSession.shared.data(for: request)

            if let httpResponse = response as? HTTPURLResponse {
                print("🔹 Event creation HTTP status:", httpResponse.statusCode)
            }

            if let dataString = String(data: data, encoding: .utf8) {
                print("🔹 Event creation response body:", dataString)
            }

            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 else {
                throw EventError.creationFailed
            }

            let created = try JSONDecoder().decode(Event.self, from: data)
            print("✅ Event created successfully:", created)
            return created

        } catch {
            print("❌ Event creation failed:", error)
            throw EventError.creationFailed
        }
    }

    static func fetchEvents() async throws -> [Event] {
        let (data, _) = try await URLSession.shared.data(from: baseURL)
        let response = try JSONDecoder().decode([String:[Event]].self, from: data)
        return response["events"] ?? []
    }
}
