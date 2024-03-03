////
////  WhenwasthelastbottlefeedingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
////
//
//import Foundation
//import Intents
//@objc class WhenwasthelastbottlefeedingIntentHandler: NSObject, WhenwasthelastbottlefeedingIntentHandling {
//  func handle(intent: WhenwasthelastbottlefeedingIntent, completion: @escaping (WhenwasthelastbottlefeedingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "When was the last bottle feeding")
//    userActivity.userInfo = ["title":"When was the last bottle feeding","babyName": intent.babyName!]
//    
//    completion(WhenwasthelastbottlefeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: WhenwasthelastbottlefeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func WhenwasthelastbottlefeedingInteraction() {
//    let intent = WhenwasthelastbottlefeedingIntent()
//    intent.suggestedInvocationPhrase = "When was the last bottle feeding"
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
