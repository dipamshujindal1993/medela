//
//  ModuleWithEmitter.m
//  MyMedela
//
//  Created by Nitish Saini on 09/02/21.
//

#import "ModuleWithEmitter.h"

@implementation ModuleWithEmitter
{
    bool hasListeners;
}

RCT_EXPORT_MODULE();
+ (id)allocWithZone:(NSZone *)zone {
    static ModuleWithEmitter *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onSessionConnect", @"killedModeListner"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = NO;
}

- (void)dispatchSiriEvent:(NSDictionary *)payload {
      if (hasListeners) {
        [self sendEventWithName:@"onSessionConnect" body:payload];
      }
}

- (void)dispatchSiriEventFromKilledMode:(NSDictionary *)payload {
      if (hasListeners) {
        [self sendEventWithName:@"killedModeListner" body:payload];
      }
}

@end
