//
//  AuthenticationService.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/23/25.
//

import Foundation

protocol AuthenticationServiceable {
    func login(email: String, password: String) async throws -> Response?
    func signup(username: String, email: String, password: String) async throws -> Response?
}

class AuthenticationService: AuthenticationServiceable {
    let base: URL = URL(string: "https://gatherly-backend-q9vm.onrender.com/")!
    
    func login(email: String, password: String) async throws -> Response? {
        let path: URL = base.appending(path: "auth/login")
        let login: Login = Login(email: email, password: password)
        var request: URLRequest = URLRequest(url: path)
        
        request.httpMethod = "POST"
        request.httpBody = try? JSONEncoder().encode(login)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            print("Invalid status code: \((response as? HTTPURLResponse)?.statusCode ?? 0)")
            return nil
        }
        
        let result = try JSONDecoder().decode(Response.self, from: data)
        return result
    }
    
    func signup(username: String, email: String, password: String) async throws -> Response? {
        let path: URL = base.appending(path: "auth/signup")
        let signup: Signup = Signup(username: username, email: email, password: password)
        var request: URLRequest = URLRequest(url: path)
        
        request.httpMethod = "POST"
        request.httpBody = try? JSONEncoder().encode(signup)
        
        let (data, response) = try! await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode != 200 else{
            print("Invalid status code: \((response as? HTTPURLResponse)?.statusCode ?? 0)")
            return nil
        }
        
        let result = try JSONDecoder().decode(Response.self, from: data)
        return result
    }
}

class AuthenticationServiceMock: AuthenticationServiceable {
    func login(email: String, password: String) async throws -> Response? {
        return nil
    }
    
    func signup(username: String, email: String, password: String) async -> Response? {
        return nil
    }
}
