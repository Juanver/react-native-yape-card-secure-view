import Foundation
import React
import UIKit

@objc(YapeCardSecureViewManager)
public class YapeCardSecureViewManager: NSObject {

  @objc public override init() {
    super.init()
  }

  @objc public func openSecureView(
    cardId: String, secureToken: String, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    let trimmedToken = secureToken.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmedToken.isEmpty {
      reject("TOKEN_INVALID", "El token es inválido o ha expirado.", nil)
      return
    }

    resolve(true)
  }

  @objc public func closeSecureView() {}

  @objc public func addListener(_ eventType: String) {}
  @objc public func removeListeners(_ count: Double) {}
}
