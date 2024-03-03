////
////  WhenWasTheLastWeightTrackingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 23/02/21.
////
////
////import Foundation
////import Intents
////
////@objc class WhenWasTheLastWeightTrackingIntentHandler: NSObject, WhenwasthelastweighttrackingIntentHandling {
////
////  @objc func handle(intent: WhenwasthelastweighttrackingIntent, completion: @escaping (WhenwasthelastweighttrackingIntentResponse) -> Void) {
////
////   // completion(PausebreastfeedingIntentResponse.success(result: "Successfully"))
////    let userActivity = NSUserActivity(activityType: "When was the last weight tracking")
////    userActivity.userInfo = ["title":"When was the last weight tracking"]
////    completion(WhenwasthelastweighttrackingIntentResponse(code: .continueInApp, userActivity: userActivity))
////  }
////
//// @objc public func WhenwasthelastweighttrackingInteraction() {
////  let intent = WhenwasthelastweighttrackingIntent()
////  intent.suggestedInvocationPhrase = "When was the last weight tracking"
////  let interaction = INInteraction(intent: intent, response: nil)
////
////  interaction.donate { (error) in
////    if error != nil {
////    if let error = error as NSError? {
////                     print("Interaction donation failed: \(error.description)")
////    } else {
////      print("Successfully donated interaction")
////    }
////    }
////  }
////  }
////}
//
//
//import Foundation
//import Intents
//@objc class WhenWasTheLastWeightTrackingIntentHandler: NSObject, WhenwasthelastweighttrackingIntentHandling {
//  func handle(intent: WhenwasthelastweighttrackingIntent, completion: @escaping (WhenwasthelastweighttrackingIntentResponse) -> Void) {
//    
//    
//    let userActivity = NSUserActivity(activityType: "When was the last weight tracking")
//    userActivity.userInfo = ["title":"When was the last weight tracking"]
//    
//    completion(WhenwasthelastweighttrackingIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
////  func resolveBabyName(for intent: StopbreastfeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
////
////    if intent.babyName == "babyName" {
////      completion(INStringResolutionResult.needsValue())
////    }else {
////      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
////    }
////  }
//  
//  @objc public func WhenwasthelastweighttrackingInteraction() {
//    let intent = WhenwasthelastweighttrackingIntent()
//    intent.suggestedInvocationPhrase = "When was the last weight tracking"
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
//}
