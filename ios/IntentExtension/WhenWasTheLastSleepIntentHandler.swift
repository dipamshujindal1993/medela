////
////  WhenWasTheLastSleepIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 22/02/21.
////
//
//import Foundation
//import Intents
//@objc class WhenWasTheLastSleepIntentHandler: NSObject, WhenwasthelastsleepIntentHandling {
//  func handle(intent: WhenwasthelastsleepIntent, completion: @escaping (WhenwasthelastsleepIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "When was the last sleep")
//    userActivity.userInfo = ["title":"When was the last sleep","babyName": intent.babyName!]
//    
//    completion(WhenwasthelastsleepIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: WhenwasthelastsleepIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func WhenWasTheLastSleepInteraction() {
//    let intent = WhenwasthelastsleepIntent()
//    intent.suggestedInvocationPhrase = "When was the last sleep"
//    intent.babyName = "babyName"
//    let interaction = INInteraction(intent: intent, response: nil)
//    interaction.donate { (error) in
//      if error != nil {
//      if let error = error as NSError? {
//                       print("Interaction donation failed: \(error.description)")
//      } else {
//        print("Successfully donated interaction")
//      }
//      }
//    }
//  }
//  
//  
//}
//
