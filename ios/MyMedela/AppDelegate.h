#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "ModuleWithEmitter.h"
#import <UserNotifications/UNUserNotificationCenter.h>




@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate> {
  NSDictionary *options;
  NSDate * launchingTimestamp;
}

@property (nonatomic, strong) UIWindow *window;

//- (void) setInitialViewController;
- (void) goToNativeView; // called from the RCTBridge module
//- (void) donateInteraction;

@end

#import <Realm/Realm.h>
@interface RealmDBSchema : NSObject
-(void)fetchRealmDB;
@end
