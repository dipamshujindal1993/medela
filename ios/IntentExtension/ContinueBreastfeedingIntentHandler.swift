//
//  ContinueBreastfeedingIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 14/02/21.
//

import Foundation
import Intents

@objc class ContinueBreastfeedingIntentHandler: NSObject, ContinuebreastfeedingIntentHandling {
  
  
  func handle(intent: ContinuebreastfeedingIntent, completion: @escaping (ContinuebreastfeedingIntentResponse) -> Void) {
    print(intent.side!)

    let userActivity = NSUserActivity(activityType: "Continue breastfeeding")
    userActivity.userInfo = ["title":"Continuebreastfeeding","side":intent.side!]
    completion(ContinuebreastfeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
    
    
//    completion(ContinuebreastfeedingIntentResponse.success(result: "Successfully"))
  }
  
  func resolveSide(for intent: ContinuebreastfeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    let side = ["Left","Right","Both"]
    
    if side.contains(intent.side!) {
      completion(INStringResolutionResult.success(with: intent.side ?? ""))
    } else {
      completion(INStringResolutionResult.needsValue())
    }
  }
  
  
 @objc public func ContinueDonateInteraction() {
  let intent = ContinuebreastfeedingIntent()
  intent.suggestedInvocationPhrase = "Continue breastfeeding"
  intent.side = "side"
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
