//
//  Models.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/24/25.
//

import Foundation

struct Login: Codable {
    let email: String
    let password: String
}

struct Signup: Codable {
    let username: String
    let email: String
    let password: String
}

struct Response: Codable {
    let token: String
    let uid: String
}

struct User {
    let username: String?
    let email: String
    let uid: String
}
