////
////  StopbottlefeedingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
////
//
//import Foundation
//import Intents
//@objc class StopbottlefeedingIntentHandler: NSObject, StopbottlefeedingIntentHandling {
//  func handle(intent: StopbottlefeedingIntent, completion: @escaping (StopbottlefeedingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "Stop bottle feeding")
//    userActivity.userInfo = ["title":"Stop bottle feeding","babyName": intent.babyName!]
//    
//    completion(StopbottlefeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: StopbottlefeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func StopbottlefeedingInteraction() {
//    let intent = StopbottlefeedingIntent()
//    intent.suggestedInvocationPhrase = "Stop bottle feeding"
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
//
