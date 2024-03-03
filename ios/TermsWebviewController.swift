//
//  WebView.swift
//  MyMedela
//
//  Created by Nitish Saini on 31/05/21.
//

import Foundation
@objc(TermsWebviewController)
class TermsWebviewController: RCTViewManager {
override func view() -> UIView! {
  return TermsNativeWebview()
}
}
