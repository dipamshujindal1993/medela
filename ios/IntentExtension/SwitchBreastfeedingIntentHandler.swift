////
////  SwitchBreastfeedingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 14/02/21.
////
//
//import Foundation
//import Intents
//
//@objc class SwitchBreastfeedingIntentHandler: NSObject, SwitchbreastfeedingsideIntentHandling {
//  func handle(intent: SwitchbreastfeedingsideIntent, completion: @escaping (SwitchbreastfeedingsideIntentResponse) -> Void) {
//    print(intent.side!)
//    
//    
//    let userActivity = NSUserActivity(activityType: "Switchbreastfeeding")
//    userActivity.userInfo = ["title":"Switchbreastfeeding","side":intent.side!]
//    completion(SwitchbreastfeedingsideIntentResponse(code: .continueInApp, userActivity: userActivity))
//    
////    completion(SwitchbreastfeedingsideIntentResponse.success(result: "Successfully"))
//  }
//  
//  func resolveSide(for intent: SwitchbreastfeedingsideIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    let side = ["Left","Right","Both"]
//    if side.contains(intent.side!) {
//      completion(INStringResolutionResult.success(with: intent.side ?? ""))
//    } else {
//      completion(INStringResolutionResult.needsValue())
//    }
//  }
//  
//  @objc public func SwitchDonateInteraction() {
//   let intent = SwitchbreastfeedingsideIntent()
//   intent.suggestedInvocationPhrase = "Switch breastfeeding"
//   intent.side = "side"
//   let interaction = INInteraction(intent: intent, response: nil)
//   
//   interaction.donate { (error) in
//     if error != nil {
//     if let error = error as NSError? {
//                      print("Interaction donation failed: \(error.description)")
//     } else {
//       print("Successfully donated interaction")
//     }
//     }
//   }
//   }
//
//  
//}
