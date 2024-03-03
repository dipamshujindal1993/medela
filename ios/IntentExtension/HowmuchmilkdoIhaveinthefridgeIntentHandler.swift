////
////  HowmuchmilkdoIhaveinthefridgeIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
//
//
//import Foundation
//import Intents
//
//@objc class HowmuchmilkdoIhaveinthefridgeIntentHandler: NSObject, HowmuchmilkdoIhaveinthefridgeIntentHandling {
//  
//  @objc func handle(intent: HowmuchmilkdoIhaveinthefridgeIntent, completion: @escaping (HowmuchmilkdoIhaveinthefridgeIntentResponse) -> Void) {
//    
//   // completion(PausebreastfeedingIntentResponse.success(result: "Successfully"))
//    let userActivity = NSUserActivity(activityType: "How much milk do I have in the fridge")
//    userActivity.userInfo = ["title":"How much milk do I have in the fridge"]
//    completion(HowmuchmilkdoIhaveinthefridgeIntentResponse(code: .continueInApp, userActivity: userActivity))
//  }
//  
// @objc public func HowmuchmilkdoIhaveinthefridgeInteraction() {
//  let intent = HowmuchmilkdoIhaveinthefridgeIntent()
//  intent.suggestedInvocationPhrase = "How much milk do I have in the fridge"
//  let interaction = INInteraction(intent: intent, response: nil)
//  
//  interaction.donate { (error) in
//    if error != nil {
//    if let error = error as NSError? {
//                     print("Interaction donation failed: \(error.description)")
//    } else {
//      print("Successfully donated interaction")
//    }
//    }
//  }
//  }
//}
