//
//  LoginViewModel.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/22/25.
//

import Foundation

@Observable
class AuthenticationViewModel {
    var service: AuthenticationServiceable = AuthenticationService()
    var loadingState: LoadingState = .idle
    var errMessage: String?
    
    var username: String
    
    init (username: String = "") {
        self.username = username
    }
    
    func login(email: String, password: String) {
        // TODO: Implement login
        Task {
            do {
                loadingState = .loading
                let result = try await service.login(email: email, password: password)
                print("Success!")
                loadingState = .finished
            } catch {
                loadingState = .idle
                errMessage = error.localizedDescription
            }
        }
    }
    
    func signup(username: String, email: String, password: String) {
        // TODO: Implement Signup
        Task {
            do {
                loadingState = .loading
                let result = try await service.signup(username: username, email: email, password: password)
                loadingState = .finished
            } catch {
                loadingState = .idle
                errMessage = error.localizedDescription
            }
        }
    }
    
    func validateUsername() -> Bool {
        // TODO: Validate username
        return true
    }
}

extension AuthenticationViewModel {
    enum LoadingState: Equatable {
        case idle
        case loading
        case finished
    }
    
    enum ErrorState: Error {
        case idle
        case invalidUsernameOrPassword
        case error(error: Error)
    }
}
