//
//  IntentHandler.swift
//  IntentExtension
//
//  Created by Somnath on 31/01/21.
//

import Intents

class IntentHandler: INExtension {
    
    override func handler(for intent: INIntent) -> Any {
      
      if intent is StartbreastfeedingIntent{
        return StartBreastfeedingIntentHandler()
      }else if intent is StopbreastfeedingIntent {
        return StopBreastfeedingIntentHandler()
      }else if intent is PausebreastfeedingIntent {
        return PauseBreastfeedingIntentHandler()
      }else if intent is ContinuebreastfeedingIntent {
        return ContinueBreastfeedingIntentHandler()
      }
//      else if intent is SwitchbreastfeedingsideIntent {
//        return SwitchBreastfeedingIntentHandler()
//      }
      else if intent is StartsleepIntent {
        return StartSleepIntentHandler()
      }else if intent is StopsleepIntent {
        return StopSleepIntentHandler()
      }
//      else if intent is WhenwasthelastsleepIntent {
//        return WhenWasTheLastSleepIntentHandler()
//      }
      else if intent is TrackadiaperbytypeIntent {
        return TrackADiaperByTypeIntentHandler()
      }
//      else if intent is WhenwasthelastdiaperchangeIntent {
//        return WhenWasTheLastDiaperChangeIntentHandler()
//      }
      else if intent is TrackweightIntent {
        return TrackWeightIntentHandler()
      }
//      else if intent is WhenwasthelastweighttrackingIntent {
//        return WhenWasTheLastWeightTrackingIntentHandler()
//      }
      else if intent is TracklengthIntent {
        return TrackLengthIntentHandler()
      }
//      else if intent is WhenwasthelastlengthtrackingIntent {
//        return WhenWasTheLastLengthTrackingIntentHandler()
//      }
//      else if intent is HowmuchmilkdoIhaveinthefridgeIntent {
//        return HowmuchmilkdoIhaveinthefridgeIntentHandler()
//      }else if intent is HowmuchmilkdoIhaveinthefreezerIntent {
//        return HowmuchmilkdoIhaveinthefreezerIntentHandler()
//      }
//      else if intent is StartbottlefeedingIntent {
//        return StartbottlefeedingIntentHandler()
//      }else if intent is PausebottlefeedingIntent {
//        return PausebottlefeedingIntentHandler()
//      }else if intent is StopbottlefeedingIntent {
//        return StopbottlefeedingIntentHandler()
//      }else if intent is ContinuebottlefeedingIntent {
//        return ContinuebottlefeedingIntentHandler()
//      }else if intent is TrackaformulafeedingIntent {
//        return TrackaformulafeedingIntentHandler()
//      }else if intent is WhenwasthelastbottlefeedingIntent {
//        return WhenwasthelastbottlefeedingIntentHandler()
//      }
      else if intent is StartpumpingIntent {
        return StartpumpingIntentHandler()
      }else if intent is StoppumpingIntent {
        return StoppumpingIntentHandler()
      }
//      else if intent is SavemilkIntent {
//        return SavemilkIntentHandler()
//      }else if intent is SavepumpingIntent {
//        return SavepumpingIntentHandler()
//      }else if intent is WhenwasthelastpumpingIntent {
//        return WhenwasthelastpumpingIntentHandler()
//      }else if intent is UsemilkIntent {
//        return UsemilkIntentHandler()
//      }
      else {
        return PauseBreastfeedingIntentHandler()
      }
    }
  
    
}
