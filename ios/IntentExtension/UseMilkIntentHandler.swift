////
////  UseMilkIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 01/03/21.
////
//
//import Foundation
//import Intents
//
//@objc class UsemilkIntentHandler: NSObject, UsemilkIntentHandling {
//  func resolveFormulaAmmount(for intent: UsemilkIntent, with completion: @escaping (UsemilkFormulaAmmountResolutionResult) -> Void) {
//    if intent.formulaAmmount == 0 {
//      completion(UsemilkFormulaAmmountResolutionResult.needsValue())
//    } else {
//      completion(UsemilkFormulaAmmountResolutionResult.success(with: Double(truncating: intent.formulaAmmount ?? 0)))
//    }
//  }
//  
//  
//  
//  @objc func handle(intent: UsemilkIntent, completion: @escaping (UsemilkIntentResponse) -> Void) {
//    
//    let userActivity = NSUserActivity(activityType: "Use Milk")
//    userActivity.userInfo = ["title":"Use Milk","babyName": intent.babyName!,"container":intent.container!,"formulaAmmount":intent.formulaAmmount!]
//    
//    completion(UsemilkIntentResponse(code: .continueInApp, userActivity: userActivity))
//    
////    completion(StartbreastfeedingIntentResponse.success(result: "Successfully"))
//  }
////  func resolveFormulaAmmount(for intent: UsemilkIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
////    if intent.formulaAmmount == "formulaAmmount" {
////      completion(INStringResolutionResult.needsValue())
////    } else {
////      completion(INStringResolutionResult.success(with: intent.formulaAmmount ?? ""))
////    }
////  }
//  
//  func resolveContainer(for intent: UsemilkIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    if intent.container == "container" {
//      completion(INStringResolutionResult.needsValue())
//    } else {
//      completion(INStringResolutionResult.success(with: intent.container ?? ""))
//    }
//  }
//  
//  
//  func resolveBabyName(for intent: UsemilkIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    } else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
// @objc public func UsemilkInteraction() {
//  let intent = UsemilkIntent()
//  intent.suggestedInvocationPhrase = "Use Milk"
//  intent.formulaAmmount = 0
//  intent.container = "container"
//  intent.babyName = "babyName"
//  let interaction = INInteraction(intent: intent, response: nil)
//  
//  interaction.donate { (error) in
//    if error != nil {
//    if let error = error as NSError? {
//                     print("Interaction donation failed: \(error.description)")
//    } else {
//      print("Successfully donated interaction")
//    }
//    }
//  }
//  }
//}
//
//
