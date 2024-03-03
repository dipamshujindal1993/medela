//
//  StopSleepIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 22/02/21.
//

import Foundation
import Intents
@objc class StopSleepIntentHandler: NSObject, StopsleepIntentHandling {
  func handle(intent: StopsleepIntent, completion: @escaping (StopsleepIntentResponse) -> Void) {
    print(intent.babyName!)
    
    let userActivity = NSUserActivity(activityType: "Stop Sleep")
    userActivity.userInfo = ["title":"Stop Sleep","babyName": intent.babyName!]
    
    completion(StopsleepIntentResponse(code: .continueInApp, userActivity: userActivity))

    
    
//    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
    
  }
  
  func resolveBabyName(for intent: StopsleepIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    
    if intent.babyName == "babyName" {
      completion(INStringResolutionResult.needsValue())
    }else {
      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
    }
  }
  
  @objc public func stopSleepInteraction() {
    let intent = StopsleepIntent()
    intent.suggestedInvocationPhrase = "Stop Sleep"
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
