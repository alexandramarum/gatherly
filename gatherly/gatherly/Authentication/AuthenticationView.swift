//
//  LoginView.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/22/25.
//

import SwiftUI

struct AuthenticationView: View {
    @Bindable private var vm: AuthenticationViewModel = AuthenticationViewModel()
    @State private var email: String = ""
    @State private var password: String = ""
    
    var body: some View {
        VStack {
            Text("gatherly!")
                .font(.system(size: 60))
                .fontWeight(.semibold)
            VStack(spacing: 10) {
                GatherlyTextField(title: "Email", text: $email)
                    .padding(.horizontal)
                    .frame(maxWidth: 500)
                GatherlyTextField(title: "Password", text: $password)
                    .padding(.horizontal)
                    .frame(maxWidth: 500)
                    .padding(.bottom, 10)
                if let error = vm.errMessage {
                    Text(error)
                }
                
                Button {
                    vm.login(email: vm.username, password: password)
                } label: {
                    GatherlyButton(text: "Log in", textColor: .primary, borderColor: .cyan)
                }
                Button {
                    
                } label: {
                    GatherlyButton(text: "Sign up", textColor: .black, backgroundColor: .white, borderColor: .white.opacity(0.6))
                }
            }
        }
    }
    
    func validateEmail() -> Bool {
        // TODO: 
        return true
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
