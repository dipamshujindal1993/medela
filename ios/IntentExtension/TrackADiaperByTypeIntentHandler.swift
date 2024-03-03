//
//  TrackADiaperByTypeIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 22/02/21.
//

import Foundation
import Intents
@objc class TrackADiaperByTypeIntentHandler: NSObject, TrackadiaperbytypeIntentHandling {
  func resolveType(for intent: TrackadiaperbytypeIntent, with completion: @escaping (DiaperTypeResolutionResult) -> Void) {
    let diaperType = intent.type
    
    switch diaperType {
    case .pee, .poo, .both:
      completion(DiaperTypeResolutionResult.success(with: diaperType))
    default:
      completion(DiaperTypeResolutionResult.needsValue())
    }
  }
  
  
  func resolveBabyName(for intent: TrackadiaperbytypeIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    
    if intent.babyName != nil {
    if intent.babyName == "babyName" {
      completion(INStringResolutionResult.needsValue())
    }else {
      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
    }
    } else {
      completion(INStringResolutionResult.needsValue())
    }
  }
  
  func handle(intent: TrackadiaperbytypeIntent, completion: @escaping (TrackadiaperbytypeIntentResponse) -> Void) {
    print(intent.babyName!)
    let diaperType = intent.type
    let userActivity = NSUserActivity(activityType: "Track a diaper")
    switch diaperType {
    case .pee:
      userActivity.userInfo = ["title":"Track a diaper","babyName": intent.babyName!,"diaperType":"pee"]
    case .poo:
      userActivity.userInfo = ["title":"Track a diaper","babyName": intent.babyName!,"diaperType":"poo"]
    case .both:
      userActivity.userInfo = ["title":"Track a diaper","babyName": intent.babyName!,"diaperType":"both"]
    default:
      userActivity.userInfo = ["title":"Track a diaper","babyName": intent.babyName!,"diaperType":"pee"]
    }
    
    
    completion(TrackadiaperbytypeIntentResponse(code: .continueInApp, userActivity: userActivity))

    
  }
  
  
  @objc public func TrackadiaperbytypeInteraction() {
    let intent = TrackadiaperbytypeIntent()
    intent.suggestedInvocationPhrase = "Track a Diaper"
    intent.babyName = "babyName"
   // intent.type = "type"
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

