//
//  TrackLengthIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 23/02/21.
//

import Foundation
import Intents
@objc class TrackLengthIntentHandler: NSObject, TracklengthIntentHandling {
  func resolveCmLength(for intent: TracklengthIntent, with completion: @escaping (TracklengthCmLengthResolutionResult) -> Void) {
    if intent.cmLength != nil {
      if intent.cmLength == 0 {
        completion(TracklengthCmLengthResolutionResult.needsValue())
      } else {
        completion(TracklengthCmLengthResolutionResult.success(with: Double(truncating: intent.cmLength ?? 0)))
      }
    }else {
      completion(TracklengthCmLengthResolutionResult.needsValue())
    }
    
  }
  
  func resolveInLength(for intent: TracklengthIntent, with completion: @escaping (TracklengthInLengthResolutionResult) -> Void) {
    if intent.inLength != nil {
      if intent.inLength == 0 {
        completion(TracklengthInLengthResolutionResult.needsValue())
      } else {
        completion(TracklengthInLengthResolutionResult.success(with: Double(truncating: intent.inLength ?? 0)))
      }
    }else {
      completion(TracklengthInLengthResolutionResult.needsValue())
    }
  }
  
  func resolveLengthType(for intent: TracklengthIntent, with completion: @escaping (LengthTypeResolutionResult) -> Void) {
    let lengthtType = intent.lengthType
    
    switch lengthtType {
    case .in, .cm :
        completion(LengthTypeResolutionResult.success(with: lengthtType))
    default:
      completion(LengthTypeResolutionResult.needsValue())
      return
    }
  }
  

  
//  func resolveLength(for intent: TracklengthIntent, with completion: @escaping (TracklengthLengthResolutionResult) -> Void) {
//    if intent.length != nil{
//      if intent.length == 0 {
//        completion(TracklengthLengthResolutionResult.needsValue())
//      } else {
//        completion(TracklengthLengthResolutionResult.success(with: Double(truncating: intent.length ?? 0)))
//      }
//    } else {
//      completion(TracklengthLengthResolutionResult.needsValue())
//    }
//
//  }
  
  
  
  func handle(intent: TracklengthIntent, completion: @escaping (TracklengthIntentResponse) -> Void) {
    print(intent.babyName!)
    let lengthtType = intent.lengthType
    let userActivity = NSUserActivity(activityType: "Track Length")
    
    switch lengthtType {
    case .cm:
      userActivity.userInfo = ["title":"Track Length","length":intent.cmLength!,"babyName": intent.babyName!,"lengthtType":"cm"]
    case .in:
      userActivity.userInfo = ["title":"Track Length","length":intent.inLength!,"babyName": intent.babyName!,"lengthtType":"inch"]
    default:
      userActivity.userInfo = ["title":"Track Length","length":intent.cmLength!,"babyName": intent.babyName!,"lengthtType":"cm"]
    }
    
    
    completion(TracklengthIntentResponse(code: .continueInApp, userActivity: userActivity))

    
    
//    completion(StopbreastfeedingIntentResponse.success(result: intent.babyName!))
    
  }
//  func resolveLength(for intent: TracklengthIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    if intent.length == "length" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.length ?? ""))
//    }
//  }
  
  func resolveBabyName(for intent: TracklengthIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    if intent.babyName != nil {
      if intent.babyName == "babyName" {
        completion(INStringResolutionResult.needsValue())
      }else {
        completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
      }
    }else {
      completion(INStringResolutionResult.needsValue())
    }
   
  }
 
  
  
  @objc public func TrackLengthInteraction() {
    let intent = TracklengthIntent()
    intent.suggestedInvocationPhrase = "Track Length"
    //intent.length = 0
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

