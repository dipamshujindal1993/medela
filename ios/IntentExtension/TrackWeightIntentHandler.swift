//
//  TrackWeightIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 23/02/21.
//

import Foundation
import Intents
@objc class TrackWeightIntentHandler: NSObject, TrackweightIntentHandling {
  func resolveLbWeight(for intent: TrackweightIntent, with completion: @escaping (TrackweightLbWeightResolutionResult) -> Void) {
    if intent.lbWeight != nil {
      if intent.lbWeight == 0 {
        completion(TrackweightLbWeightResolutionResult.needsValue())
      } else {
        completion(TrackweightLbWeightResolutionResult.success(with: Double(truncating: intent.lbWeight ?? 0)))
      }
    }else {
      completion(TrackweightLbWeightResolutionResult.needsValue())
    }

  }
  
  func resolveKgWeight(for intent: TrackweightIntent, with completion: @escaping (TrackweightKgWeightResolutionResult) -> Void) {
    if intent.kgWeight != nil {
      if intent.kgWeight == 0 {
        completion(TrackweightKgWeightResolutionResult.needsValue())
      } else {
        completion(TrackweightKgWeightResolutionResult.success(with: Double(truncating: intent.kgWeight ?? 0)))
      }
    }else {
      completion(TrackweightKgWeightResolutionResult.needsValue())
    }

  }
  
  func resolveWeightType(for intent: TrackweightIntent, with completion: @escaping (WeightTypeResolutionResult) -> Void) {
    let weightType = intent.weightType
    
    switch weightType {
    case .lb, .kg:
      completion(WeightTypeResolutionResult.success(with: weightType))
    default:
      completion(WeightTypeResolutionResult.needsValue())
      return
    }
  }
 
  
  func handle(intent: TrackweightIntent, completion: @escaping (TrackweightIntentResponse) -> Void) {
    let weightType = intent.weightType
    let userActivity = NSUserActivity(activityType: "Track Weight")
    switch weightType {
    case .kg:
      userActivity.userInfo = ["title":"Track Weight","babyName": intent.babyName!,"weight":intent.kgWeight!,"weightType":"Kg"]
    case .lb:
      userActivity.userInfo = ["title":"Track Weight","babyName": intent.babyName!,"weight":intent.lbWeight!,"weightType":"lb"]
    default:
      userActivity.userInfo = ["title":"Track Weight","babyName": intent.babyName!,"weight":intent.kgWeight!,"weightType":"Kg"]
    }
    
    completion(TrackweightIntentResponse(code: .continueInApp, userActivity: userActivity))

    
    
//    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
    
  }
  
//  func resolveWeight(for intent: TrackweightIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//
//    if intent.weight == "weight" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.weight ?? ""))
//    }
//  }
  
  func resolveBabyName(for intent: TrackweightIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
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
  
  @objc public func TrackweightInteraction() {
    let intent = TrackweightIntent()
    intent.suggestedInvocationPhrase = "Track Weight"
    intent.babyName = "babyName"
   // intent.weight = 0
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
