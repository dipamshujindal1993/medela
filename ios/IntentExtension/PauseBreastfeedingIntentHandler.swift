//
//  PausebreastfeedingIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 11/02/21.
//

import Foundation
import Intents

@objc class PauseBreastfeedingIntentHandler: NSObject, PausebreastfeedingIntentHandling {
  
  @objc func handle(intent: PausebreastfeedingIntent, completion: @escaping (PausebreastfeedingIntentResponse) -> Void) {
    
   // completion(PausebreastfeedingIntentResponse.success(result: "Successfully"))
    let userActivity = NSUserActivity(activityType: "Pause breastfeeding")
    userActivity.userInfo = ["title":"Pause breastfeeding"]
    completion(PausebreastfeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
  }
  
 @objc public func pauseDonateInteraction() {
  let intent = PausebreastfeedingIntent()
  intent.suggestedInvocationPhrase = "Pause breastfeeding"
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

