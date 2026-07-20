package com.yapecardsecureview

import com.facebook.react.bridge.ReactApplicationContext

class YapeCardSecureViewModule(reactContext: ReactApplicationContext) :
  NativeYapeCardSecureViewSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeYapeCardSecureViewSpec.NAME
  }
}
