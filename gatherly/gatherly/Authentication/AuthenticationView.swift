//
//  LoginView.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/22/25.
//

import SwiftUI

struct AuthenticationView: View {
    @Bindable private var vm: AuthenticationViewModel = AuthenticationViewModel()

    @State private var isSignup: Bool = false
    @State private var username: String = ""
    @State private var email: String = ""
    @State private var password: String = ""

    var body: some View {
        VStack(spacing: 16) {
            Text("gatherly")
                .font(.system(size: 60))
                .fontWeight(.semibold)

            VStack(spacing: 10) {
                if isSignup {
                    GatherlyTextField(title: "Username", text: $username)
                        .padding(.horizontal)
                        .frame(maxWidth: 500)
                        .transition(.opacity.combined(with: .move(edge: .top)))
                }

                GatherlyTextField(title: "Email", text: $email)
                    .padding(.horizontal)
                    .frame(maxWidth: 500)

                GatherlyTextField(title: "Password", text: $password)
                    .padding(.horizontal)
                    .frame(maxWidth: 500)
                    .padding(.bottom, 10)

                if case let .error(err) = vm.loadingState {
                    Text(err)
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                
                signupLoginButton

                Button {
                    isSignup.toggle()
                } label: {
                    Text(isSignup ? "Already have an account? Log in" : "Don’t have an account? Sign up")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .padding(.top, 4)
                }
            }
        }
        .animation(.snappy, value: isSignup)
        .transition(.move(edge: .bottom).combined(with: .opacity))
        .padding()
    }
    
    var signupLoginButton: some View {
        Button {
            if isSignup {
                vm.signup(username: username, email: email, password: password)
            } else {
                vm.login(email: email, password: password)
            }
        } label: {
            GatherlyButton(
                text: isSignup ? "Create Account" : "Log In",
                textColor: .primary,
                borderColor: .cyan
            )
        }
    }

}


struct GatherlyTextField: View {
    var title: String
    @Binding var text: String
    
    var body: some View {
        TextField(title, text: $text)
            .padding(10)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
    }
}

struct GatherlyButton: View {
    var text: String
    var textColor: Color
    var backgroundColor: Color = .clear
    var borderColor: Color = .clear

    var body: some View {
        Text(text)
            .fontWeight(.semibold)
            .font(.title3)
            .foregroundStyle(textColor)
            .frame(width: 200, height: 44)
            .background(backgroundColor, in: RoundedRectangle(cornerRadius: 16))
            .overlay {
                RoundedRectangle(cornerRadius: 16)
                    .stroke(borderColor, lineWidth: 1)
            }
    }
}

#Preview {
    AuthenticationView()
        .preferredColorScheme(.dark)
}
