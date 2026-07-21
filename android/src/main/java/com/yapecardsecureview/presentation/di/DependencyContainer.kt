package com.yapecardsecureview.presentation.di

import com.yapecardsecureview.domain.usecase.ValidateSecureTokenUseCase

object DependencyContainer {
  fun provideValidateSecureTokenUseCase(): ValidateSecureTokenUseCase = ValidateSecureTokenUseCase()
}
