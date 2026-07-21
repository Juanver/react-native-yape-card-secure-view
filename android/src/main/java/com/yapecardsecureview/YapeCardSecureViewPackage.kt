package com.yapecardsecureview

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.yapecardsecureview.presentation.YapeCardSecureViewModule
import com.yapecardsecureview.presentation.di.DependencyContainer

class YapeCardSecureViewPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val validateTokenUseCase = DependencyContainer.provideValidateSecureTokenUseCase()
        val module = YapeCardSecureViewModule(reactContext, validateTokenUseCase)
        
        return listOf(module)
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}