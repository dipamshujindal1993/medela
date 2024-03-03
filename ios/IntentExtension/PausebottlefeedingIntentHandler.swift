////
////  PausebottlefeedingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
////
//
//import Foundation
//import Intents
//@objc class PausebottlefeedingIntentHandler: NSObject, PausebottlefeedingIntentHandling {
//  func handle(intent: PausebottlefeedingIntent, completion: @escaping (PausebottlefeedingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "Pause bottle feeding")
//    userActivity.userInfo = ["title":"Pause bottle feeding","babyName": intent.babyName!]
//    
//    completion(PausebottlefeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: PausebottlefeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func PausebottlefeedingInteraction() {
//    let intent = PausebottlefeedingIntent()
//    intent.suggestedInvocationPhrase = "Pause bottle feeding"
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
