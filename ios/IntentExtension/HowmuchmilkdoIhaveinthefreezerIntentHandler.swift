////
////  HowmuchmilkdoIhaveinthefreezerIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
////
//
//import Foundation
//import Intents
//
//@objc class HowmuchmilkdoIhaveinthefreezerIntentHandler: NSObject, HowmuchmilkdoIhaveinthefreezerIntentHandling {
//  
//  @objc func handle(intent: HowmuchmilkdoIhaveinthefreezerIntent, completion: @escaping (HowmuchmilkdoIhaveinthefreezerIntentResponse) -> Void) {
//    
//   // completion(PausebreastfeedingIntentResponse.success(result: "Successfully"))
//    let userActivity = NSUserActivity(activityType: "HowmuchmilkdoIhaveinthefreezer")
//    userActivity.userInfo = ["title":"How much milk do I have in the freezer"]
//    completion(HowmuchmilkdoIhaveinthefreezerIntentResponse(code: .continueInApp, userActivity: userActivity))
//  }
//  
// @objc public func HowmuchmilkdoIhaveinthefreezerInteraction() {
//  let intent = HowmuchmilkdoIhaveinthefreezerIntent()
//  intent.suggestedInvocationPhrase = "How much milk do I have in the freezer"
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
