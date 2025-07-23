//
//  LoginViewModel.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/22/25.
//

import Foundation

@Observable
class LoginViewModel {
    var username: String
    var password: String
    
    init (username: String = "", password: String = "") {
        self.username = username
        self.password = password
    }
    
    func login() {
        // TODO: Implement login
    }
    
    func signup() {
        // TODO: Implement Signup
    }
    
    func validateUsername() -> Bool {
        // TODO: Validate username
        return true
    }
}

extension LoginViewModel {
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
