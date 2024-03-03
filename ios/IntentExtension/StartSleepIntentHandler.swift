//
//  StartSleepIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 22/02/21.
//

import Foundation
import Intents
@objc class StartSleepIntentHandler: NSObject, StartsleepIntentHandling {
  func handle(intent: StartsleepIntent, completion: @escaping (StartsleepIntentResponse) -> Void) {
    print(intent.babyName!)
    
    let userActivity = NSUserActivity(activityType: "Start Sleep")
    userActivity.userInfo = ["title":"Start Sleep","babyName": intent.babyName!]
    
    completion(StartsleepIntentResponse(code: .continueInApp, userActivity: userActivity))

    
    
//    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
    
  }
  
  func resolveBabyName(for intent: StartsleepIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    
    if intent.babyName == "babyName" {
      completion(INStringResolutionResult.needsValue())
    }else {
      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
    }
  }
  
  @objc public func startSleepInteraction() {
    let intent = StartsleepIntent()
    intent.suggestedInvocationPhrase = "Start Sleep"
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
