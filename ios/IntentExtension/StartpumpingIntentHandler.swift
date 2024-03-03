//
//  StartpumpingIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 25/02/21.
//

import Foundation
import Intents

@objc class StartpumpingIntentHandler: NSObject, StartpumpingIntentHandling {
  @objc func handle(intent: StartpumpingIntent, completion: @escaping (StartpumpingIntentResponse) -> Void) {
    print(intent.babyName!)
    
    
    let userActivity = NSUserActivity(activityType: "Start Pumping")
    userActivity.userInfo = ["title":"Start Pumping","babyName": intent.babyName]
    
    completion(StartpumpingIntentResponse(code: .continueInApp, userActivity: userActivity))
    
//    completion(StartbreastfeedingIntentResponse.success(result: "Successfully"))
  }
  
  func resolveBabyName(for intent: StartpumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    if intent.babyName == "babyName" {
      completion(INStringResolutionResult.needsValue())
    } else {
      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
    }
  }
  
 @objc public func StartpumpingInteraction() {
  let intent = StartpumpingIntent()
  intent.suggestedInvocationPhrase = "Start Pumping"
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

