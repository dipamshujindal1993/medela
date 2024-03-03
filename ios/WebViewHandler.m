//
//  WebViewHandler.m
//  MyMedela
//
//  Created by Nitish Saini on 31/05/21.
//

#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"
@interface RCT_EXTERN_MODULE(WebViewController, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(htmlstring, NSString)
//RCT_EXPORT_VIEW_PROPERTY(onStatusChange, RCTDirectEventBlock)
@end
