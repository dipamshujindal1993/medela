////
////  WhenwasthelastpumpingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 25/02/21.
////
//
//
//import Foundation
//import Intents
//@objc class WhenwasthelastpumpingIntentHandler: NSObject, WhenwasthelastpumpingIntentHandling {
//  func handle(intent: WhenwasthelastpumpingIntent, completion: @escaping (WhenwasthelastpumpingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "When was the last pumping")
//    userActivity.userInfo = ["title":"When was the last pumping","babyName": intent.babyName!]
//    
//    completion(WhenwasthelastpumpingIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: WhenwasthelastpumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func WhenwasthelastpumpingInteraction() {
//    let intent = WhenwasthelastpumpingIntent()
//    intent.suggestedInvocationPhrase = "When was the last pumping"
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
//
