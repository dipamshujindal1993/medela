////
////  TrackaformulafeedingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 24/02/21.
////
//
//import Foundation
//import Intents
//@objc class TrackaformulafeedingIntentHandler: NSObject, TrackaformulafeedingIntentHandling {
//  
//  func resolveFormulaAmmount(for intent: TrackaformulafeedingIntent, with completion: @escaping (TrackaformulafeedingFormulaAmmountResolutionResult) -> Void) {
//    if intent.formulaAmmount == 0 {
//      completion(TrackaformulafeedingFormulaAmmountResolutionResult.needsValue())
//    } else {
//      completion(TrackaformulafeedingFormulaAmmountResolutionResult.success(with: Double(truncating: intent.formulaAmmount ?? 0)))
//    }
//  }
//  
//  
//  
//  func handle(intent: TrackaformulafeedingIntent, completion: @escaping (TrackaformulafeedingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    
//    let userActivity = NSUserActivity(activityType: "Track a formula feeding")
//    userActivity.userInfo = ["title":"Track a formula feeding","formulaAmmount":intent.formulaAmmount!,"babyName": intent.babyName!]
//    
//    completion(TrackaformulafeedingIntentResponse(code: .continueInApp, userActivity: userActivity))
//    
//  }
// 
////  func resolveFormulaAmmount(for intent: TrackaformulafeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
////    if intent.formulaAmmount == "formulaAmmount" {
////      completion(INStringResolutionResult.needsValue())
////    }else {
////      completion(INStringResolutionResult.success(with: intent.formulaAmmount ?? ""))
////    }
////  }
//  func resolveBabyName(for intent: TrackaformulafeedingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    }else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
//  @objc public func TrackaformulafeedingInteraction() {
//    let intent = TrackaformulafeedingIntent()
//    intent.suggestedInvocationPhrase = "Track a formula feeding"
//    intent.formulaAmmount = 0
//    intent.babyName = "babyName"
//    let interaction = INInteraction(intent: intent, response: nil)
//    interaction.donate { (error) in
//      if error != nil {
//      if let error = error as NSError? {
//                       print("Interaction donation failed: \(error.description)")
//      } else {
//        print("Successfully donated interaction")
//      }
//      }
//    }
//  }
//  
//  
//}
//
//
