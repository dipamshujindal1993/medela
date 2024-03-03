//
//  WebView.swift
//  MyMedela
//
//  Created by Nitish Saini on 31/05/21.
//

import Foundation
@objc(WebViewController)
class WebViewController: RCTViewManager {
override func view() -> UIView! {
  return NativeWebview()
}
}
