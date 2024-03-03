

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "AppDelegate.h"

@interface RCT_EXTERN_MODULE(PacifySDKModule, NSObject)

RCT_EXTERN_METHOD(callPacify:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback)

RCT_EXPORT_METHOD(changeToNativeView) {

  
//  AllShortcutsViewController *rootController = (AllShortcutsViewController* [[[(AppDelegate*)
//                                                                               [[UIApplication sharedApplication]delegate] window] rootViewController]] )
                                                
  NSLog(@"RN binding - Native View - AllShortcutsViewController.swift - Load From");
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  [appDelegate goToNativeView];
//
//
}



+ (BOOL)requiresMainQueueSetup {
    return NO;
}

@end
