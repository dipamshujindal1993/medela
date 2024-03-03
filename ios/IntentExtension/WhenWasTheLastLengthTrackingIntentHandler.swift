////
////  WhenWasTheLastLengthTrackingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 23/02/21.
////
//
//import Foundation
//import Intents
//
//@objc class WhenWasTheLastLengthTrackingIntentHandler: NSObject, WhenwasthelastlengthtrackingIntentHandling {
//  
//  @objc func handle(intent: WhenwasthelastlengthtrackingIntent, completion: @escaping (WhenwasthelastlengthtrackingIntentResponse) -> Void) {
//    
//   // completion(PausebreastfeedingIntentResponse.success(result: "Successfully"))
//    let userActivity = NSUserActivity(activityType: "When was the last length tracking")
//    userActivity.userInfo = ["title":"When was the last length tracking"]
//    completion(WhenwasthelastlengthtrackingIntentResponse(code: .continueInApp, userActivity: userActivity))
//  }
//  
// @objc public func WhenwasthelastlengthtrackingInteraction() {
//  let intent = WhenwasthelastlengthtrackingIntent()
//  intent.suggestedInvocationPhrase = "When was the last length tracking"
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
//
//
