////
////  StartbottlefeedingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
////
//
//import Foundation
//import Intents
//@objc class StartbottlefeedingIntentHandler: NSObject, StartbottlefeedingIntentHandling {
//  func handle(intent: StartbottlefeedingIntent, completion: @escaping (StartbottlefeedingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "Start bottle feeding")
//    userActivity.userInfo = ["title":"Start bottle feeding","babyName": intent.babyName!]
//    
//    completion(StartbottlefeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
//
//    
//    
////    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
//    
//  }
//  
//  func resolveBabyName(for intent: StartbottlefeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func StartbottlefeedingInteraction() {
//    let intent = StartbottlefeedingIntent()
//    intent.suggestedInvocationPhrase = "Start bottle feeding"
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
