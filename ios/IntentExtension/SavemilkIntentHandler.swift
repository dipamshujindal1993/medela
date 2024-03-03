////
////  SavemilkIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 25/02/21.
////
//
//import Foundation
//import Intents
//
//@objc class SavemilkIntentHandler: NSObject, SavemilkIntentHandling {
//  
//  func resolveFormulaAmmount(for intent: SavemilkIntent, with completion: @escaping (SavemilkFormulaAmmountResolutionResult) -> Void) {
//    if intent.formulaAmmount == 0 {
//      completion(SavemilkFormulaAmmountResolutionResult.needsValue())
//    } else {
//      completion(SavemilkFormulaAmmountResolutionResult.success(with: Double(truncating: intent.formulaAmmount ?? 0)))
//    }
//  }
//  
//  
//  
//  @objc func handle(intent: SavemilkIntent, completion: @escaping (SavemilkIntentResponse) -> Void) {
////    print(intent.container!)
////    print(intent.babyName!)
////    print(intent.formulaAmmount!)
////    print(intent.fridge!)
//    
//    
//    let userActivity = NSUserActivity(activityType: "Save Milk")
//    userActivity.userInfo = ["title":"Save Milk","babyName": intent.babyName!,"container":intent.container!,"formulaAmmount":intent.formulaAmmount!,"fridge":intent.fridge!]
//    
//    completion(SavemilkIntentResponse(code: .continueInApp, userActivity: userActivity))
//    
////    completion(StartbreastfeedingIntentResponse.success(result: "Successfully"))
//  }
////  func resolveFormulaAmmount(for intent: SavemilkIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
////    if intent.formulaAmmount == "formulaAmmount" {
////      completion(INStringResolutionResult.needsValue())
////    } else {
////      completion(INStringResolutionResult.success(with: intent.formulaAmmount ?? ""))
////    }
////  }
//  
//  func resolveContainer(for intent: SavemilkIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    if intent.container == "container" {
//      completion(INStringResolutionResult.needsValue())
//    } else {
//      completion(INStringResolutionResult.success(with: intent.container ?? ""))
//    }
//  }
//  
//  func resolveFridge(for intent: SavemilkIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    
//    let fridge = ["Fridge","Freezer"]
//    
//    if fridge.contains(intent.fridge!) {
//      completion(INStringResolutionResult.success(with: intent.fridge ?? ""))
//    } else {
//      completion(INStringResolutionResult.needsValue())
//    }
//  }
//  
//  func resolveBabyName(for intent: SavemilkIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    } else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
// @objc public func SavemilkInteraction() {
//  let intent = SavemilkIntent()
//  intent.suggestedInvocationPhrase = "Save Milk"
//  intent.formulaAmmount = 0
//  intent.container = "container"
//  intent.fridge = "fridge"
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
