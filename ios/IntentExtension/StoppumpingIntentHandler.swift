//
//  StoppumpingIntentHandler.swift
//  MyMedela
//
//  Created by somnath panda on 25/02/21.
//

import Foundation
import Intents
@objc class StoppumpingIntentHandler: NSObject, StoppumpingIntentHandling {
  
  
  func resolveMlMilkQty(for intent: StoppumpingIntent, with completion: @escaping (StoppumpingMlMilkQtyResolutionResult) -> Void) {
    if intent.mlMilkQty != nil && intent.mlMilkQty != 0 {
      completion(StoppumpingMlMilkQtyResolutionResult.success(with: Double(truncating: intent.mlMilkQty ?? 0)))
    } else {
      completion(StoppumpingMlMilkQtyResolutionResult.needsValue())
    }
  }
  
  func resolveOzMilkQty(for intent: StoppumpingIntent, with completion: @escaping (StoppumpingOzMilkQtyResolutionResult) -> Void) {
    if intent.ozMilkQty != nil && intent.ozMilkQty != 0 {
      completion(StoppumpingOzMilkQtyResolutionResult.success(with: Double(truncating: intent.ozMilkQty ?? 0)))
    } else {
      completion(StoppumpingOzMilkQtyResolutionResult.needsValue())
    }
  }
  
  func resolveMilkUnit(for intent: StoppumpingIntent, with completion: @escaping (MilkUnitResolutionResult) -> Void) {
    let milkUnit = intent.milkUnit
    
    switch milkUnit {
    case .oz, .ml:
      completion(MilkUnitResolutionResult.success(with: milkUnit))
    default:
      completion(MilkUnitResolutionResult.needsValue())
    }
    
  }
  
  
  func resolveSaveMilk(for intent: StoppumpingIntent, with completion: @escaping (SaveMilkResolutionResult) -> Void) {
    let saveMilk = intent.saveMilk
    
    switch saveMilk {
    case .no, .yes:
      completion(SaveMilkResolutionResult.success(with: saveMilk))
    default:
      completion(SaveMilkResolutionResult.needsValue())
      return
    }
  }
  
  func resolveBabyName(for intent: StoppumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    
    if intent.babyName != nil && intent.babyName != "babyName" {
      completion(INStringResolutionResult.success(with: intent.babyName ?? ""))
    }else {
      completion(INStringResolutionResult.needsValue())
    }
  }
  
  
  func resolveContainer(for intent: StoppumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    let container = ["Bottle","Bag","Bagh","Back"]
    
    if intent.container != nil && intent.container != "container" {
      if container.contains(intent.container!) {
        completion(INStringResolutionResult.success(with: intent.container ?? ""))
      } else {
        completion(INStringResolutionResult.needsValue())
      }
    } else {
      completion(INStringResolutionResult.needsValue())
    }
  }
  
  func resolveFridge(for intent: StoppumpingIntent, with completion: @escaping (INStringResolutionResult) -> Void) {
    let fridge = ["Fridge","Freezer","Please"]
    if intent.fridge != nil && intent.fridge != "fridge" {
      if fridge.contains(intent.fridge!) {
        completion(INStringResolutionResult.success(with: intent.fridge ?? ""))
      } else {
        completion(INStringResolutionResult.needsValue())
      }
    } else {
      completion(INStringResolutionResult.needsValue())
    }
  }
  
  func resolveBottleNumber(for intent: StoppumpingIntent, with completion: @escaping (StoppumpingBottleNumberResolutionResult) -> Void) {
    
    if intent.bottleNumber != nil && intent.bottleNumber != 0 {
      completion(StoppumpingBottleNumberResolutionResult.success(with: Int(truncating: intent.bottleNumber ?? 0)))
    } else {
      completion(StoppumpingBottleNumberResolutionResult.needsValue())
    }
    
  }
  
  func resolveTrayNumber(for intent: StoppumpingIntent, with completion: @escaping (StoppumpingTrayNumberResolutionResult) -> Void) {
    if intent.trayNumber != nil && intent.trayNumber != 0 {
      completion(StoppumpingTrayNumberResolutionResult.success(with: Int(truncating: intent.trayNumber ?? 0)))
    } else {
      completion(StoppumpingTrayNumberResolutionResult.needsValue())
    }
  }
  
  func handle(intent: StoppumpingIntent, completion: @escaping (StoppumpingIntentResponse) -> Void) {
    print(intent.babyName!)
    let saveMilk = intent.saveMilk
    let userActivity = NSUserActivity(activityType: "Stop Pumping")
    
    
    switch intent.milkUnit {
    case .oz:
      switch saveMilk {
      case .no:
        userActivity.userInfo = ["title":"Stop Pumping","babyName": intent.babyName!,"milkUnit":"oz","milkQuantity":intent.ozMilkQty!,"isSaveMilk":"No"]
      case .yes:
        userActivity.userInfo = ["title":"Stop Pumping","babyName": intent.babyName!,"container":intent.container!,"milkUnit":"oz","milkQuantity":intent.ozMilkQty!,"fridge":intent.fridge!,"isSaveMilk":"Yes","bottleNumber":intent.bottleNumber!,"trayNumber":intent.trayNumber!]
      default:
        userActivity.userInfo = ["title":"Stop Pumping","babyName": intent.babyName!]
      }
    case .ml:
      switch saveMilk {
      case .no:
        userActivity.userInfo = ["title":"Stop Pumping","babyName": intent.babyName!,"milkUnit":"ml","milkQuantity":intent.mlMilkQty!,"isSaveMilk":"No"]
      case .yes:
        userActivity.userInfo = ["title":"Stop Pumping","babyName": intent.babyName!,"container":intent.container!,"milkUnit":"ml","milkQuantity":intent.mlMilkQty!,"fridge":intent.fridge!,"isSaveMilk":"Yes","bottleNumber":intent.bottleNumber!,"trayNumber":intent.trayNumber!]
      default:
        userActivity.userInfo = ["title":"Stop Pumping","babyName": intent.babyName!]
      }
    default:
      userActivity.userInfo = ["title":"Stop Pumping","babyName": intent.babyName!]
    }

    completion(StoppumpingIntentResponse(code: .continueInApp, userActivity: userActivity))

  }
  
  @objc public func StoppumpingInteraction() {
    let intent = StoppumpingIntent()
    intent.suggestedInvocationPhrase = "Stop Pumping"
    intent.babyName = "babyName"
    intent.container = "container"
    intent.fridge = "fridge"
    intent.trayNumber = 0
    intent.bottleNumber = 0
    
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

