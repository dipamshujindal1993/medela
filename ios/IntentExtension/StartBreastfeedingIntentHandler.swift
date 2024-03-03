//
//  StartBreastfeedingIntentHandler.swift
//  IntentExtension
//
//  Created by somnath panda on 04/02/21.
//

import Foundation
import Intents

@objc class StartBreastfeedingIntentHandler: NSObject, StartbreastfeedingIntentHandling {
  @objc func handle(intent: StartbreastfeedingIntent, completion: @escaping (StartbreastfeedingIntentResponse) -> Void) {
    print(intent.side!)
    print(intent.babyName!)
    
    
    let userActivity = NSUserActivity(activityType: "Start breastfeeding")
    userActivity.userInfo = ["title":"Start breastfeeding","babyName": intent.babyName!,"side":intent.side!]
    
    completion(StartbreastfeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
    
//    completion(StartbreastfeedingIntentResponse.success(result: "Successfully"))
  }
  
  func resolveSide(for intent: StartbreastfeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    let side = ["Left","Right","Both"]
    
    if side.contains(intent.side!) {
      completion(INStringResolutionResult.success(with: intent.side ?? ""))
    } else {
      completion(INStringResolutionResult.needsValue())
    }
  }
  
  func resolveBabyName(for intent: StartbreastfeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    if intent.babyName == "babyName" {
      completion(INStringResolutionResult.needsValue())
    } else {
      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
    }
  }
  
 @objc public func donateInteraction() {
  let intent = StartbreastfeedingIntent()
  intent.suggestedInvocationPhrase = "Start breastfeeding"
  intent.side = "side"
  intent.babyName = "babyName"
  let interaction = INInteraction(intent: intent, response: nil)
  
  interaction.donate { (error) in
    if error != nil {
    if let error = error as NSError? {
                     print("Interaction donation failed: \(error.description)")
    } else {
      print("Successfully donated interaction")
    }
    }
  }
  }
}
