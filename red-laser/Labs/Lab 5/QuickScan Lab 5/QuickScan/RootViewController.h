//
//  RootViewController.h
//  QuickScan
//
//  Created by Chall Fry on 9/27/11.
//  Copyright 2011 eBay. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ProductWebViewController.h"
#import "RedLaserSDK.h"

@interface RootViewController : UIViewController <ProductWebViewDelegate, BarcodePickerControllerDelegate>
{
	IBOutlet UITextField 				*UPCTextEntry;
	IBOutlet UIButton 					*lookupButton;
	IBOutlet UIActivityIndicatorView	*lookupActivity;

	// URL Viewing
	ProductWebViewController			*productPage;
}
- (IBAction) lookupButtonHit:(id)sender;
- (IBAction) redLaserButtonHit:(id) sender;

@end
