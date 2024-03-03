//
//  ModuleWithEmitter.h
//  MyMedela
//
//  Created by Nitish Saini on 09/02/21.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface ModuleWithEmitter : RCTEventEmitter <RCTBridgeModule>
+ (id)allocWithZone:(NSZone *)zone;
- (void)dispatchSiriEvent:(NSDictionary *)payload;
- (void)dispatchSiriEventFromKilledMode:(NSDictionary *)payload;

@end

NS_ASSUME_NONNULL_END
