//
//  ShortcutsManager.swift
//  ManagingShortcuts
//
//  Created by Julian Schiavo on 8/9/2019.
//  Copyright © 2019 Julian Schiavo. All rights reserved.
//

import Intents
import IntentsUI

protocol ShortcutsManagerDelegate: AnyObject {
    func shortcutViewControllerDidCancel()
    func shortcutViewControllerDidFinish(with shortcut: ShortcutsManager.Shortcut)
    func shortcutViewControllerDidDeleteShortcut(_ shortcut: ShortcutsManager.Shortcut, identifier: UUID)
    func shortcutViewControllerFailed(with error: Error?)
}

class ShortcutsManager {
    enum Kind: String, Hashable, CaseIterable {

        case startBreastfeeding
        case stopBreastfeeding
        case pauseBreastfeeding
        case continueBreastfeeding
//        case switchBreastfeedingside
        case startSleep
        case stopSleep
//        case Whenwasthelastsleep
        case Trackadiaperbytype
//        case Whenwasthelastdiaperchange
        case Trackweight
//        case Whenwasthelastweighttracking
        case Tracklength
//        case Whenwasthelastlengthtracking
//        case HowmuchmilkdoIhaveinthefridge
//        case HowmuchmilkdoIhaveinthefreezer
//        case Usemilk
//        case Startbottlefeeding
//        case Pausebottlefeeding
//        case Stopbottlefeeding
//        case Continuebottlefeeding
//        case Trackaformulafeeding
//        case Whenwasthelastbottlefeeding
        case Startpumping
        case StopPumping
//        case Savemilk
//        case Savepumping
//        case Whenwasthelastpumping
//
      
      
        var intent: INIntent {
            let intent = intentType.init()
            intent.suggestedInvocationPhrase = suggestedInvocationPhrase
            return intent
        }
        
        var intentType: INIntent.Type {
            switch self {
            case .startBreastfeeding:
              return StartbreastfeedingIntent.self
            case .stopBreastfeeding:
              return StopbreastfeedingIntent.self
            case .pauseBreastfeeding:
              return PausebreastfeedingIntent.self
            case .continueBreastfeeding:
              return ContinuebreastfeedingIntent.self
//            case .switchBreastfeedingside:
//              return SwitchbreastfeedingsideIntent.self
            case .startSleep:
              return StartsleepIntent.self
            case .stopSleep:
              return StopsleepIntent.self
//            case .Whenwasthelastsleep:
//              return  WhenwasthelastsleepIntent.self
            case .Trackadiaperbytype:
              return TrackadiaperbytypeIntent.self
//            case .Whenwasthelastdiaperchange:
//              return WhenwasthelastdiaperchangeIntent.self
            case .Trackweight:
              return TrackweightIntent.self
//            case .Whenwasthelastweighttracking:
//              return WhenwasthelastweighttrackingIntent.self
            case .Tracklength:
              return TracklengthIntent.self
//            case .Whenwasthelastlengthtracking:
//              return WhenwasthelastlengthtrackingIntent.self
//            case .HowmuchmilkdoIhaveinthefridge:
//              return HowmuchmilkdoIhaveinthefridgeIntent.self
//            case .HowmuchmilkdoIhaveinthefreezer:
//              return HowmuchmilkdoIhaveinthefreezerIntent.self
//            case .Usemilk:
//              return UsemilkIntent.self
//            case .Startbottlefeeding:
//              return StartbottlefeedingIntent.self
//            case .Pausebottlefeeding:
//              return PausebottlefeedingIntent.self
//            case .Stopbottlefeeding:
//              return StopbottlefeedingIntent.self
//            case .Continuebottlefeeding:
//              return ContinuebottlefeedingIntent.self
//            case .Trackaformulafeeding:
//              return TrackaformulafeedingIntent.self
//            case .Whenwasthelastbottlefeeding:
//              return WhenwasthelastbottlefeedingIntent.self
            case .Startpumping:
              return StartpumpingIntent.self
            case .StopPumping:
              return StoppumpingIntent.self
//            case .Savemilk:
//              return SavemilkIntent.self
//            case .Savepumping:
//              return SavepumpingIntent.self
//            case .Whenwasthelastpumping:
//              return WhenwasthelastpumpingIntent.self
            }
        }
        
        var suggestedInvocationPhrase: String? {
            switch self {
            case .startBreastfeeding:
              return "Start Breastfeeding"
            case .stopBreastfeeding:
               return "Stop Breastfeeding"
            case .pauseBreastfeeding:
              return "Pause Breastfeeding"
            case .continueBreastfeeding:
              return "Continue Breastfeeding"
//            case .switchBreastfeedingside:
//              return "Switch Breastfeedingside"
            case .startSleep:
              return "Start Sleep"
            case .stopSleep:
              return "Stop Sleep"
//            case .Whenwasthelastsleep:
//              return "When was the last sleep"
            case .Trackadiaperbytype:
              return "Track a diaper by type"
//            case .Whenwasthelastdiaperchange:
//              return "When was the last diaper change"
            case .Trackweight:
              return "Track Weight"
//            case .Whenwasthelastweighttracking:
//              return "When was the last weight tracking"
            case .Tracklength:
              return "Track Length"
//            case .Whenwasthelastlengthtracking:
//              return "When was the last length tracking"
//            case .HowmuchmilkdoIhaveinthefridge:
//              return "How much milk do I have in the fridge"
//            case .HowmuchmilkdoIhaveinthefreezer:
//              return "How much milk do I have in the freezer"
//            case .Usemilk:
//              return "Use Milk"
//            case .Startbottlefeeding:
//              return "Start bottle feeding"
//            case .Pausebottlefeeding:
//              return "Pause bottle feeding"
//            case .Stopbottlefeeding:
//              return "Stop bottle feeding"
//            case .Continuebottlefeeding:
//              return "Continue bottle feeding"
//            case .Trackaformulafeeding:
//              return "Track a formula feeding"
//            case .Whenwasthelastbottlefeeding:
//              return "When was the last bottle feeding"
            case .Startpumping:
              return "Start pumping"
            case .StopPumping:
              return "Stop pumping"
//            case .Savemilk:
//              return "Save Milk"
//            case .Savepumping:
//              return "Save pumping"
//            case .Whenwasthelastpumping:
//              return "When was the last pumping"
            }
        }
    }
    
    struct Shortcut: Hashable {
        var kind: Kind
        var intent: INIntent
        var voiceShortcut: INVoiceShortcut?
        
        var invocationPhrase: String? {
            voiceShortcut?.invocationPhrase
        }
    }
    
    private init() { }
    static let shared = ShortcutsManager()
    
    // MARK: - Shortcuts View Controller
    
    private var delegates = [String: DelegateProxy]()
    
    /// Shows either a `INUIAddVoiceShortcutViewController` or `INUIEditVoiceShortcutViewController` based on whether the user has already added the shortcut to Siri
    public func showShortcutsPhraseViewController(for shortcut: Shortcut, on viewController: UIViewController, delegate: ShortcutsManagerDelegate) {
        let delegateProxy = DelegateProxy(shortcut: shortcut, delegate: delegate) { [weak self] in
            self?.delegates[shortcut.kind.rawValue] = nil
        }
        delegates[shortcut.kind.rawValue] = delegateProxy
        
        if let voiceShortcut = shortcut.voiceShortcut {
            let editController = INUIEditVoiceShortcutViewController(voiceShortcut: voiceShortcut)
            editController.delegate = delegateProxy
            viewController.present(editController, animated: true)
        } else {
            guard let shortcut = INShortcut(intent: shortcut.kind.intent) else { return }
            let addController = INUIAddVoiceShortcutViewController(shortcut: shortcut)
            addController.delegate = delegateProxy
            viewController.present(addController, animated: true)
        }
    }
    
    // MARK: - Loading Shortcuts
    
    /// Checks whether the `INVoiceShortcut`'s intent is the same type as an intent type
    private func isVoiceShortcut<IntentType>(_ voiceShortcut: INVoiceShortcut, intentOfType type: IntentType.Type) -> Bool where IntentType: INIntent {
        voiceShortcut.shortcut.intent?.isKind(of: type) ?? false
    }
    
    /// Creates an array of `Shortcut` objects, which may contain a voice shortcut if they have been added to Siri
    func loadShortcuts(kinds: [Kind], completion: @escaping ([Shortcut]) -> Void) {
        INVoiceShortcutCenter.shared.getAllVoiceShortcuts { [weak self] voiceShortcuts, error in
            guard let self = self, let voiceShortcuts = voiceShortcuts, error == nil else {
                completion(kinds.map { Shortcut(kind: $0, intent: $0.intent) })
                return
            }
            
            var shortcuts = [Shortcut]()
            for kind in kinds {
                let filteredVoiceShortcuts = voiceShortcuts.filter({ self.isVoiceShortcut($0, intentOfType: kind.intentType) })
                
                guard !filteredVoiceShortcuts.isEmpty else {
                    let shortcut = Shortcut(kind: kind, intent: kind.intent)
                    shortcuts.append(shortcut)
                    continue
                }
                
                for voiceShortcut in filteredVoiceShortcuts {
                    let shortcut = Shortcut(kind: kind, intent: kind.intent, voiceShortcut: voiceShortcut)
                    shortcuts.append(shortcut)
                }
            }
            
            completion(shortcuts)
        }
    }
    
    // MARK: - Delegate Proxy
    
    private class DelegateProxy: NSObject, INUIAddVoiceShortcutViewControllerDelegate, INUIEditVoiceShortcutViewControllerDelegate {
        
        var shortcut: Shortcut
        weak var delegate: ShortcutsManagerDelegate?
        var completion: () -> Void
        
        init(shortcut: Shortcut, delegate: ShortcutsManagerDelegate, completion: @escaping () -> Void) {
            self.shortcut = shortcut
            self.delegate = delegate
            self.completion = completion
        }
        
        // MARK: - INUIAddVoiceShortcutViewControllerDelegate
        
        func addVoiceShortcutViewControllerDidCancel(_ controller: INUIAddVoiceShortcutViewController) {
            controller.dismiss(animated: true)
            delegate?.shortcutViewControllerDidCancel()
            completion()
        }
        
        func addVoiceShortcutViewController(_ controller: INUIAddVoiceShortcutViewController, didFinishWith voiceShortcut: INVoiceShortcut?, error: Error?) {
            defer { completion() }
            controller.dismiss(animated: true)
            
            guard let voiceShortcut = voiceShortcut else {
                delegate?.shortcutViewControllerFailed(with: error)
                return
            }
            
            shortcut.voiceShortcut = voiceShortcut
            delegate?.shortcutViewControllerDidFinish(with: shortcut)
        }
        
        // MARK: - INUIEditVoiceShortcutViewControllerDelegate
        
        func editVoiceShortcutViewControllerDidCancel(_ controller: INUIEditVoiceShortcutViewController) {
            controller.dismiss(animated: true)
            delegate?.shortcutViewControllerDidCancel()
            completion()
        }
        
        func editVoiceShortcutViewController(_ controller: INUIEditVoiceShortcutViewController, didUpdate voiceShortcut: INVoiceShortcut?, error: Error?) {
            defer { completion() }
            controller.dismiss(animated: true)
            
            guard let voiceShortcut = voiceShortcut else {
                delegate?.shortcutViewControllerFailed(with: error)
                return
            }
            
            shortcut.voiceShortcut = voiceShortcut
            delegate?.shortcutViewControllerDidFinish(with: shortcut)
        }
        
        func editVoiceShortcutViewController( _ controller: INUIEditVoiceShortcutViewController, didDeleteVoiceShortcutWithIdentifier deletedVoiceShortcutIdentifier: UUID) {
            controller.dismiss(animated: true)
            delegate?.shortcutViewControllerDidDeleteShortcut(shortcut, identifier: deletedVoiceShortcutIdentifier)
            completion()
        }
    }
}
