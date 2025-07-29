//
//  LoginViewModel.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/22/25.
//

import Foundation

@Observable
class AuthenticationViewModel {
    var loadingState: LoadingState = .idle
    var username: String
    
    init (username: String = "") {
        self.username = username
    }
    
    func login(email: String, password: String) {
        Task {
            do {
                loadingState = .loading
                let result = try await AuthenticationService.shared.login(email: email, password: password)
                if let result = result {
                    let user = User(
                        username: self.username,
                        email: email,
                        uid: result.uid
                    )
                    AuthenticationService.shared.state = .authenticated(user: user)
                    loadingState = .idle
                }
            } catch {
                loadingState = .error(err: error.localizedDescription)
            }
        }
    }
    
    func signup(username: String, email: String, password: String) {
        Task {
            do {
                loadingState = .loading
                let result = try await AuthenticationService.shared.signup(username: username, email: email, password: password)
                if let result = result {
                    let user = User(
                        username: username,
                        email: email,
                        uid: result.uid
                    )
                    AuthenticationService.shared.state = .authenticated(user: user)
                    loadingState = .idle
                }
            } catch {
                loadingState = .error(err: error.localizedDescription)
            }
        }
    }
    
    func validateCredentials() -> Bool {
        // TODO: validate w/ regex, etc.
        return true
    }
}

extension AuthenticationViewModel {
    enum LoadingState: Equatable {
        case idle
        case loading
        case error(err: String)
    }
}
