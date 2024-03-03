//
//  File.swift
//  MyMedela
//
//  Created by Nitish Saini on 31/05/21.
//

import Foundation
import UIKit
import WebKit
class NativeWebview: UIView, WKUIDelegate {
  
  @objc var htmlstring: String = ""
  var webView: WKWebView!
  
  override public func layoutSubviews() {
     super.layoutSubviews()


    self.initWebView()
    let frame = CGRect(x: 0, y: 0, width: self.frame.width, height: self.frame.height)
    webView.frame = frame
   }
  
  private func initWebView() {
    let webConfiguration = WKWebViewConfiguration()
    webView = WKWebView(frame: .zero, configuration: webConfiguration)
    webView.uiDelegate = self
    print(htmlstring)
//    let myURL = URL(string:htmlstring)
//    let myRequest = URLRequest(url: myURL!)
    self.addSubview(webView)
    // 1
    if let indexURL = Bundle.main.url(forResource: htmlstring,
                                      withExtension: "html") {
                
        // 2
       webView.loadFileURL(indexURL,allowingReadAccessTo: indexURL)
    }
//    webView.loadHTMLString(htmlstring, baseURL: nil)
  }
  

}
