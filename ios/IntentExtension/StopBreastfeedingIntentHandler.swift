//
//  StopBreastfeedingIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 15/02/21.
//

import Foundation
import Intents
@objc class StopBreastfeedingIntentHandler: NSObject, StopbreastfeedingIntentHandling {
  func handle(intent: StopbreastfeedingIntent, completion: @escaping (StopbreastfeedingIntentResponse) -> Void) {
    
    
    let userActivity = NSUserActivity(activityType: "Stop breastfeeding")
    userActivity.userInfo = ["title":"StopBreastfeeding"]
    
    completion(StopbreastfeedingIntentResponse(code: .continueInApp, userActivity: userActivity))

    
    
//    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
    
  }
  
//  func resolveBabyName(for intent: StopbreastfeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
  
  @objc public func stopInteraction() {
    let intent = StopbreastfeedingIntent()
    intent.suggestedInvocationPhrase = "Stop breastfeeding"
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
