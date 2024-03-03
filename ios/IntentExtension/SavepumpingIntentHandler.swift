////
////  SavepumpingIntentHandler.swift
////  MyMedela
////
////  Created by somnath panda on 25/02/21.
////
//
//import Foundation
//import Intents
//
//@objc class SavepumpingIntentHandler: NSObject, SavepumpingIntentHandling {
//  
//  func resolveFormulaAmmount(for intent: SavepumpingIntent, with completion: @escaping (SavepumpingFormulaAmmountResolutionResult) -> Void) {
//    if intent.formulaAmmount == 0 {
//      completion(SavepumpingFormulaAmmountResolutionResult.needsValue())
//    } else {
//      completion(SavepumpingFormulaAmmountResolutionResult.success(with: Double(truncating: intent.formulaAmmount ?? 0)))
//    }
//  }
//  
//  
//  
//  @objc func handle(intent: SavepumpingIntent, completion: @escaping (SavepumpingIntentResponse) -> Void) {
//    print(intent.babyName!)
//    print(intent.formulaAmmount!)
//    print(intent.side!)
//    
//    
//    let userActivity = NSUserActivity(activityType: "Save Pumping")
//    userActivity.userInfo = ["title":"Save Pumping","side":intent.side!,"formulaAmmount":intent.formulaAmmount!,"babyName": intent.babyName!,]
//    
//    completion(SavepumpingIntentResponse(code: .continueInApp, userActivity: userActivity))
//    
////    completion(StartbreastfeedingIntentResponse.success(result: "Successfully"))
//  }
////  func resolveFormulaAmmount(for intent: SavepumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
////    if intent.formulaAmmount == "formulaAmmount" {
////      completion(INStringResolutionResult.needsValue())
////    } else {
////      completion(INStringResolutionResult.success(with: intent.formulaAmmount ?? ""))
////    }
////  }
//  
//  func resolveSide(for intent: SavepumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    let side = ["Left","Right","Both"]
//    
//    if side.contains(intent.side!) {
//      completion(INStringResolutionResult.success(with: intent.side ?? ""))
//    } else {
//      completion(INStringResolutionResult.needsValue())
//    }
//  }
//  
//  func resolveBabyName(for intent: SavepumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
//    if intent.babyName == "babyName" {
//      completion(INStringResolutionResult.needsValue())
//    } else {
//      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
//    }
//  }
//  
// @objc public func SavepumpingInteraction() {
//  let intent = SavepumpingIntent()
//  intent.suggestedInvocationPhrase = "Save Pumping"
//  intent.side = "side"
//  intent.formulaAmmount = 0
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
