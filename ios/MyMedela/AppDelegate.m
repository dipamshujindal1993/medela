#import <Firebase.h>
#import "AppDelegate.h"
#import <RNCPushNotificationIOS.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNUserDefaults.h"
#import "React/RCTI18nUtil.h"
#import "MyMedela-Swift.h"
#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

@class AllShortcutsViewController;
@class RealmDB

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
//  StartBreastfeedingIntentHandler * objStartBreastfeeding = [[StartBreastfeedingIntentHandler alloc]init];
//  [objStartBreastfeeding donateInteraction];
//
//  StopBreastfeedingIntentHandler * objStopBreastfeeding = [[StopBreastfeedingIntentHandler alloc]init];
//  [objStopBreastfeeding stopInteraction];
//
//  PauseBreastfeedingIntentHandler * objPauseBreastfeeding = [[PauseBreastfeedingIntentHandler alloc]init];
//  [objPauseBreastfeeding pauseDonateInteraction];
//
//  ContinueBreastfeedingIntentHandler * objContinueBreastfeeding = [[ContinueBreastfeedingIntentHandler alloc]init];
//  [objContinueBreastfeeding ContinueDonateInteraction];

// SwitchBreastfeedingIntentHandler  * objSwitchBreastfeeding = [[SwitchBreastfeedingIntentHandler alloc]init];
//  [objSwitchBreastfeeding SwitchDonateInteraction];
//
//  StartSleepIntentHandler  * objStartSleep = [[StartSleepIntentHandler alloc]init];
//   [objStartSleep startSleepInteraction];

//  StopSleepIntentHandler  * objStopSleep = [[StopSleepIntentHandler alloc]init];
//   [objStopSleep stopSleepInteraction];

//  WhenWasTheLastSleepIntentHandler  * objWhenwasthelastsleep = [[WhenWasTheLastSleepIntentHandler alloc]init];
//   [objWhenwasthelastsleep WhenWasTheLastSleepInteraction];

//  TrackADiaperByTypeIntentHandler  * objTrackADiaperByType = [[TrackADiaperByTypeIntentHandler alloc]init];
//   [objTrackADiaperByType TrackadiaperbytypeInteraction];

//  WhenWasTheLastDiaperChangeIntentHandler  * objWhenWasTheLastDiaperChange = [[WhenWasTheLastDiaperChangeIntentHandler alloc]init];
//   [objWhenWasTheLastDiaperChange WhenwasthelastdiaperchangeInteraction];

//  TrackWeightIntentHandler  * objTrackWeight = [[TrackWeightIntentHandler alloc]init];
//   [objTrackWeight TrackweightInteraction];

//  WhenWasTheLastWeightTrackingIntentHandler  * objWhenWasTheLastWeightTracking = [[WhenWasTheLastWeightTrackingIntentHandler alloc]init];
//   [objWhenWasTheLastWeightTracking WhenwasthelastweighttrackingInteraction];

//  TrackLengthIntentHandler  * objTrackLength = [[TrackLengthIntentHandler alloc]init];
//   [objTrackLength TrackLengthInteraction];

//  WhenWasTheLastLengthTrackingIntentHandler  * objWhenWasTheLastLengthTracking = [[WhenWasTheLastLengthTrackingIntentHandler alloc]init];
//   [objWhenWasTheLastLengthTracking WhenwasthelastlengthtrackingInteraction];





//  HowmuchmilkdoIhaveinthefridgeIntentHandler  * objHowmuchmilkdoIhaveinthefridge = [[HowmuchmilkdoIhaveinthefridgeIntentHandler alloc]init];
//   [objHowmuchmilkdoIhaveinthefridge HowmuchmilkdoIhaveinthefridgeInteraction];
//
//  HowmuchmilkdoIhaveinthefreezerIntentHandler  * objHowmuchmilkdoIhaveinthefreezer = [[HowmuchmilkdoIhaveinthefreezerIntentHandler alloc]init];
//    [objHowmuchmilkdoIhaveinthefreezer HowmuchmilkdoIhaveinthefreezerInteraction];
//
//
//  UsemilkIntentHandler  * objUsemilk = [[UsemilkIntentHandler alloc]init];
//    [objUsemilk UsemilkInteraction];
//
//  StartbottlefeedingIntentHandler  * objStartbottlefeeding = [[StartbottlefeedingIntentHandler alloc]init];
//    [objStartbottlefeeding StartbottlefeedingInteraction];
//
//  PausebottlefeedingIntentHandler  * objPausebottlefeeding = [[PausebottlefeedingIntentHandler alloc]init];
//    [objPausebottlefeeding PausebottlefeedingInteraction];
//
//  StopbottlefeedingIntentHandler  * objStopbottlefeeding = [[StopbottlefeedingIntentHandler alloc]init];
//    [objStopbottlefeeding StopbottlefeedingInteraction];
//
//  ContinuebottlefeedingIntentHandler  * objContinuebottlefeeding = [[ContinuebottlefeedingIntentHandler alloc]init];
//    [objContinuebottlefeeding ContinuebottlefeedingInteraction];
//
//  TrackaformulafeedingIntentHandler  * objTrackaformulafeeding = [[TrackaformulafeedingIntentHandler alloc]init];
//    [objTrackaformulafeeding TrackaformulafeedingInteraction];
//
//  WhenwasthelastbottlefeedingIntentHandler  * objWhenwasthelastbottlefeeding = [[WhenwasthelastbottlefeedingIntentHandler alloc]init];
//    [objWhenwasthelastbottlefeeding WhenwasthelastbottlefeedingInteraction];
//
//
//  StartpumpingIntentHandler  * objStartpumping = [[StartpumpingIntentHandler alloc]init];
//    [objStartpumping StartpumpingInteraction];
//
//  StoppumpingIntentHandler  * objStoppumping = [[StoppumpingIntentHandler alloc]init];
//    [objStoppumping StoppumpingInteraction];
//
//  SavemilkIntentHandler  * objSavemilk = [[SavemilkIntentHandler alloc]init];
//    [objSavemilk SavemilkInteraction];
//
//  SavepumpingIntentHandler  * objSavepumping = [[SavepumpingIntentHandler alloc]init];
//    [objSavepumping SavepumpingInteraction];
//
//  WhenwasthelastpumpingIntentHandler  * objWhenwasthelastpumping = [[WhenwasthelastpumpingIntentHandler alloc]init];
//    [objWhenwasthelastpumping WhenwasthelastpumpingInteraction];
//

//  [NSThread sleepForTimeInterval:5.0];

//  for (NSString* family in [UIFont familyNames])
//  {
//    NSLog(@"%@", family);
//    for (NSString* name in [UIFont fontNamesForFamilyName: family])
//    {
//      NSLog(@" %@", name);
//    }
//  }
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"MyMedela"
                                            initialProperties:nil];

//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.5f green:1.8f blue:1.0f alpha:1];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:240/255 green:120/255 blue:140/255 alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
 
 
 
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

/*
  NSDictionary* infoDict = [[NSBundle mainBundle] infoDictionary];
  NSString* SERVER_URL = [infoDict objectForKey:@"SERVER_URL"];47

  NSLog(@"%@", SERVER_URL);
   */

  if (@available(iOS 13, *)) {
      self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
  }
 
  launchingTimestamp = [NSDate date];
//  RealmDBSchema * schema = [[RealmDBSchema alloc]init];
//  [schema fetchRealmDB];

  [[RCTI18nUtil sharedInstance] allowRTL:YES];
  // Define UNUserNotificationCenter
 UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
 center.delegate = self;
  // Added this code for RTL Support in Using device language
  NSArray *allSupportedLanguages = [NSArray arrayWithObjects:@"en",@"ar",@"fr",@"it",@"de",@"pt",@"es",@"nl",@"sv",@"no",@"da",@"ru",@"nb",@"pl",nil];
  NSArray *RTL_LANGS = [NSArray arrayWithObjects:@"ar",nil];
  NSDictionary *appLangauge = [[RNUserDefaults getDefaultUser] objectForKey:@"selected_language_locale"];
  NSDictionary *prevDeviceLanguage = [[RNUserDefaults getDefaultUser] objectForKey:@"device_lang_when_changed_from_app"];
  NSDictionary *tempUserLocale = [[RNUserDefaults getDefaultUser] objectForKey:@"app_visibility_changed_at_the_time_of_signup_or_login"];
  NSString *temp2UserLocale=[NSString stringWithFormat:@"%@", tempUserLocale];
  NSString *userLocale = [temp2UserLocale substringToIndex:2];
  NSString *deviceLanguage = [[NSLocale preferredLanguages] objectAtIndex:0];
  NSDictionary *languageDic = [NSLocale componentsFromLocaleIdentifier:deviceLanguage];
  NSString *languageCode = [languageDic objectForKey:@"kCFLocaleLanguageCodeKey"];
  NSLog(@"Device language = %@",languageCode);
  NSLog(@"PrevDevice language = %@",prevDeviceLanguage);
  NSLog(@"app language = %@",appLangauge);
  NSLog(@"userLocale = %@",userLocale);
  if (userLocale!=NULL && [allSupportedLanguages containsObject: userLocale]){
    appLangauge=userLocale;
  }else if (prevDeviceLanguage!=NULL && languageCode != NULL) {
    if (![prevDeviceLanguage isEqual:languageCode]) {
      appLangauge=languageCode;
    }
  }
  NSLog(@"app language = %@",appLangauge);
  if ([allSupportedLanguages containsObject: languageCode]) {
    if (appLangauge != NULL) {
      if([RTL_LANGS containsObject:appLangauge]){
        [[RCTI18nUtil sharedInstance] forceRTL:YES];
      }else{
        [[RCTI18nUtil sharedInstance] forceRTL:NO];
      }
    } else {
      if([RTL_LANGS containsObject: languageCode]){
          [[RCTI18nUtil sharedInstance] forceRTL:YES];
      }else{
        [[RCTI18nUtil sharedInstance] forceRTL:NO];
      }
    }
   }else{
     [[RCTI18nUtil sharedInstance] forceRTL:NO];
  }
  return YES;
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

//// IOS 10+ Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  NSTimeInterval secondsBetween = [[NSDate date] timeIntervalSinceDate:launchingTimestamp];
  if(secondsBetween < 3) {
    //From Killed mode
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 5.0 * NSEC_PER_SEC);
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        //code to be executed on the main queue after delay
      [RNCPushNotificationIOS didReceiveNotificationResponse:response];
      completionHandler();
    });
  } else {
    [RNCPushNotificationIOS didReceiveNotificationResponse:response];
    completionHandler();
  }
}

//-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
//{
//  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
//}



- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
- (void)goToNativeView {
 
      dispatch_async(dispatch_get_main_queue(), ^{

        AllShortcutsViewController *vc =  [[AllShortcutsViewController alloc]init];// This is your native iOS VC
           UINavigationController* navigationController = [[UINavigationController alloc] initWithRootViewController:vc];

        // Do this instead
        [self.window.rootViewController presentViewController:navigationController animated:true completion:NULL];

      });
    }



- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {

  NSTimeInterval secondsBetween = [[NSDate date] timeIntervalSinceDate:launchingTimestamp];
  NSDictionary *responseDict = userActivity.userInfo;
  ModuleWithEmitter *notification = [ModuleWithEmitter allocWithZone:nil];

  if(secondsBetween < 3) {
    //From Killed mode
    double delayInSeconds = 2.0;
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        //code to be executed on the main queue after delay
      [notification dispatchSiriEventFromKilledMode: @{@"Event": responseDict}];
    });
  } else {
    [notification dispatchSiriEvent: @{@"Event": responseDict}];
  }
//   secondsBetween < 3 ? [self performSelector:@selector(delayedAction:) withObject:responseDict afterDelay:5.0] : [self delayedAction:responseDict];
   return YES;
}

@end




//
//@interface VirtualFreezerSchema : RLMObject
//
//@property int location;
//@property int containerType;
//
//@end
//
//@implementation VirtualFreezerSchema
//@end
//
//RLM_ARRAY_TYPE(Dog)
//
//@interface Person : RLMObject
//
//@property NSString             *name;
//@property RLMArray<Dog *><Dog> *dogs;
//
//@end
//
//@implementation Person
//@end


@implementation RealmDBSchema
-(void)fetchRealmDB {
  RLMRealm *realm = [RLMRealm defaultRealm];
  RLMObjectSchema *schema = [realm.schema schemaForClassName:@"VirtualFreezerSchema"];
  // valueForKey:@"VirtualFreezerSchema"
  //RLMResults *results = [realm allObjects:@"VirtualFreezerSchema"];
  NSLog(@"%@", schema);
  //[realm allObjects:<#(nonnull NSString *)#>];
  //VirtualFreezerSchema

}
@end
