////
////  WhenWasTheLastDiaperChangeIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 22/02/21.
////
//
//import Foundation
//import Intents
//@objc class WhenWasTheLastDiaperChangeIntentHandler: NSObject, WhenwasthelastdiaperchangeIntentHandling {
//  func handle(intent: WhenwasthelastdiaperchangeIntent, completion: @escaping (WhenwasthelastdiaperchangeIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "When was the last diaper change")
//    userActivity.userInfo = ["title":"When was the last diaper change","babyName": intent.babyName!]
//    
//    completion(WhenwasthelastdiaperchangeIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: WhenwasthelastdiaperchangeIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func WhenwasthelastdiaperchangeInteraction() {
//    let intent = WhenwasthelastdiaperchangeIntent()
//    intent.suggestedInvocationPhrase = "When was the last diaper change"
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
