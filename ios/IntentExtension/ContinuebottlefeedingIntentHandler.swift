////
////  ContinuebottlefeedingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
////
//
//import Foundation
//import Intents
//@objc class ContinuebottlefeedingIntentHandler: NSObject, ContinuebottlefeedingIntentHandling {
//  func handle(intent: ContinuebottlefeedingIntent, completion: @escaping (ContinuebottlefeedingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "Continue bottle feeding")
//    userActivity.userInfo = ["title":"Continue bottle feeding","babyName": intent.babyName!]
//    
//    completion(ContinuebottlefeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: ContinuebottlefeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func ContinuebottlefeedingInteraction() {
//    let intent = ContinuebottlefeedingIntent()
//    intent.suggestedInvocationPhrase = "Continue bottle feeding"
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
