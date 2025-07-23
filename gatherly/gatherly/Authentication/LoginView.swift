//
//  LoginView.swift
//  gatherly
//
//  Created by Alexandra Marum on 7/22/25.
//

import SwiftUI

struct LoginView: View {
    @Bindable private var vm: LoginViewModel = LoginViewModel()
    
    var body: some View {
        VStack {
            Text("gatherly!")
                .font(.system(size: 60))
                .fontWeight(.semibold)
            VStack(spacing: 10) {
                GatherlyTextField(title: "Email", text: $vm.username)
                    .padding(.horizontal)
                    .frame(maxWidth: 500)
                GatherlyTextField(title: "Password", text: $vm.password)
                    .padding(.horizontal)
                    .frame(maxWidth: 500)
                    .padding(.bottom, 10)
                GatherlyButton(text: "Log in", textColor: .primary, borderColor: .cyan)
                GatherlyButton(text: "Sign up", textColor: .black, backgroundColor: .white, borderColor: .white.opacity(0.6))
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
        Button {} label: {
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
}

#Preview {
    LoginView()
        .preferredColorScheme(.dark)
}
