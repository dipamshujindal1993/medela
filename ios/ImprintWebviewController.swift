//
//  WebView.swift
//  MyMedela
//
//  Created by Nitish Saini on 31/05/21.
//

import Foundation
@objc(ImprintWebviewController)
class ImprintWebviewController: RCTViewManager {
override func view() -> UIView! {
  return ImprintNativeWebview()
}
}
