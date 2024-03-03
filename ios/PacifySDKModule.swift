

import Foundation
import Kingfisher
import UIKit
import PacifySDK


@objc(PacifySDKModule)
class PacifySDKModule: NSObject {
  @objc
  func callPacify (_ args: NSDictionary, callback cb: RCTResponseSenderBlock) {

    print("Args");
    print(args);
    let apiKey:String = args["apiKey"] as? String ?? ""
    let userToken:String = args["userToken"] as? String ?? ""
    let coupon:String? = args["coupon"] as? String ?? nil
    let name:String = args["name"] as? String ?? ""
    let email:String = args["email"] as? String ?? ""
    
    print(apiKey)
    print(userToken)
     let userData = PacifyUserData(
         firstName: name,
         lastName: "",
         email: email)
     
     let appearance = PacifyAppearance(
         backgroundColor: UIColor(red: 1.00, green: 1.00, blue: 1.00, alpha: 1.00),
         navigationBarTintColor: UIColor(red: 1.00, green: 1.00, blue: 1.00, alpha: 1.00),
         navigationBarTitleColor: UIColor.black.withAlphaComponent(0.8),
         buttonBackgroundColor: UIColor(red: 1.00, green: 0.80, blue: 0.15, alpha: 1.00),
         buttonTitleColor: UIColor.white,
      textColor: UIColor(red: 0.46, green: 0.46, blue: 0.46, alpha: 1.00),
         companyLogo: UIImage(named: "logo"))
     
     let supportInfo = PacifySupportInfo(
         email: "customer.service@medela.com", //used on home screen as support email
         phone: "800-435-8316") // used on home screen as suppor email
     
     let settings = PacifySettings(
         appearance: appearance,
         environment: .testing,
         logLevel: .error,
         supportInfo: supportInfo,
         appTitle: "Medela 24/7 LC", //embedding application title, used in title of back button and in new user congratulation message
         language: .english_us,
         currency: .USD,
         signUpIntroConfig: PacifySignupIntroConfiguration(serviceDescription: "Talk to providers via video call. Access is unlimited, on-demand, and 24/7."),
         mainScreenConfig: PacifyMainScreenConfiguration(callButtonsTitleLabelText: "Who would you like to contact?", isDisplayVideoIcon: false), // optional
         audioOutput: .speaker // optional, available values: .default, .speaker
     )
       
    print("calling pacify from main thread")
    DispatchQueue.main.async {
      Pacify.call(apiKey: apiKey, userToken: userToken, coupon: coupon, userData: userData, settings: settings, delegate: nil)
    }
    
    cb([
      "pacifyCalled"
    ])
   }

}
