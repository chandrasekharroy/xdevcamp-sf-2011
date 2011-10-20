//
//  ProductWebViewController.h
//  QuickScan
//
//  Created by Chall Fry on 9/29/11.
//  Copyright 2011 Critical Path Software. All rights reserved.
//

#import <UIKit/UIKit.h>

@class ProductWebViewController;

@protocol ProductWebViewDelegate <NSObject>

@optional
- (void) webViewBecameReadyToDisplay:(ProductWebViewController *) controller;
- (void) webViewFailedToLoad:(ProductWebViewController *) controller;

@end

@interface ProductWebViewController : UIViewController <UIWebViewDelegate>
{
	IBOutlet UIWebView 			*productView;
	NSURL 						*destURL;
	
	// eBay web service, uses NSURLConnection
	NSHTTPURLResponse					*response;
	NSMutableData						*responseData;
	
	id <ProductWebViewDelegate> delegate;
	bool						initialPageLoaded;
}
@property (nonatomic, retain) IBOutlet UIWebView *productView;
@property (nonatomic, retain) id <ProductWebViewDelegate> delegate;

- (void) setDestinationURL:(NSURL *) url;
- (bool) findEbayProductForUPC:(NSString *) upcText;

@end
