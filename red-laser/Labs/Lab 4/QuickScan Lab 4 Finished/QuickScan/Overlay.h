//
//  Overlay.h
//  QuickScan
//
//  Created by Chall Fry on 9/27/11.
//  Copyright 2011 eBay. All rights reserved.
//

#import "RedLaserSDK.h"

@interface Overlay : CameraOverlayViewController

@property (nonatomic, assign) BarcodePickerController *bpc;

- (IBAction) doneButtonHit:(id)sender;

@end
