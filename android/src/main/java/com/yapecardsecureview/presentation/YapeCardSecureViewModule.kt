package com.yapecardsecureview.presentation

import android.view.WindowManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.yapecardsecureview.NativeYapeCardSecureViewSpec
import com.yapecardsecureview.domain.usecase.ValidateSecureTokenUseCase

class YapeCardSecureViewModule(
  reactContext: ReactApplicationContext,
  private val validateTokenUseCase: ValidateSecureTokenUseCase,
) : NativeYapeCardSecureViewSpec(reactContext) {
  override fun getName(): String = "YapeCardSecureView"

  override fun openSecureView(
    cardId: String,
    secureToken: String,
    promise: Promise,
  ) {
    val isValid = validateTokenUseCase.execute(secureToken)

    if (!isValid) {
      promise.reject("TOKEN_INVALID", "El token es inválido o ha expirado.")
      return
    }

    reactApplicationContext.currentActivity?.runOnUiThread {
      reactApplicationContext.currentActivity?.window?.setFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
        WindowManager.LayoutParams.FLAG_SECURE,
      )
    }

    val params = Arguments.createMap().apply { putString("cardId", cardId) }
    sendEvent("onSecureViewOpened", params)

    sendEvent("onCardDataShown", params)

    promise.resolve(true)
  }

  override fun closeSecureView() {
    reactApplicationContext.currentActivity?.runOnUiThread {
      reactApplicationContext.currentActivity?.window?.clearFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
      )
    }

    val params = Arguments.createMap().apply { putString("reason", "USER_DISMISS") }
    sendEvent("onSecureViewClosed", params)
  }

  override fun addListener(eventType: String) {}

  override fun removeListeners(count: Double) {}

  private fun sendEvent(
    eventName: String,
    params: WritableMap?,
  ) {
    try {
      reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    } catch (e: Exception) {
    }
  }
}
