#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <React/RCTEventEmitter.h>

#import "YapeCardSecureViewSpec.h"
#import "YapeCardSecureView.h"
#import "YapeCardSecureView-Swift.h"

@implementation YapeCardSecureView {
  YapeCardSecureViewManager *_swiftManager;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _swiftManager = [[YapeCardSecureViewManager alloc] init];
  }
  return self;
}

- (void)openSecureView:(NSString *)cardId
           secureToken:(NSString *)secureToken
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
  [_swiftManager openSecureViewWithCardId:cardId
                              secureToken:secureToken
                                  resolve:resolve
                                   reject:reject];
}

- (void)closeSecureView {
  [_swiftManager closeSecureView];
}

- (void)addListener:(NSString *)eventType {
  [_swiftManager addListener:eventType];
}

- (void)removeListeners:(double)count {
  [_swiftManager removeListeners:count];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeYapeCardSecureViewSpecJSI>(
      params);
}

RCT_EXPORT_MODULE(YapeCardSecureView)

@end
