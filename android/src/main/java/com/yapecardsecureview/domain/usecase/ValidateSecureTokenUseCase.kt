package com.yapecardsecureview.domain.usecase

class ValidateSecureTokenUseCase {
  fun execute(token: String): Boolean {
    if (token.isBlank()) return false

    return true
  }
}
