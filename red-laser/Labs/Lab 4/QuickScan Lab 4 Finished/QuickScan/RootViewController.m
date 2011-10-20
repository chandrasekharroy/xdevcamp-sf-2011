//
//  RootViewController.m
//  QuickScan
//
//  Created by Chall Fry on 9/27/11.
//  Copyright 2011 eBay. All rights reserved.
//

#import "RootViewController.h"
#import "Overlay.h"

@implementation RootViewController

/*******************************************************************************
	initWithCoder:

	Called by the nib loading apparatus. This controller is loaded from the 
	MainWindowController.
*/
- (id) initWithCoder:(NSCoder *)decoder
{
	if ((self = [super initWithCoder:decoder]))
	{
		productPage = [[ProductWebViewController alloc] init];
		[productPage setDelegate:self];
	}
	
	return self;
}

/*******************************************************************************
	dealloc

	
*/
- (void) dealloc
{
	if ([self isViewLoaded])
		[self viewDidUnload];
		
	[productPage release];
			
    [super dealloc];
}

/*******************************************************************************
	viewDidLoad

	
*/
- (void) viewDidLoad
{
	[super viewDidLoad];
	
	// Set up our 'cheater' button
	self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"Auto"
			style:UIBarButtonItemStyleBordered target:self action:@selector(autoFillButtonHit:)];
}

/*******************************************************************************
	viewDidUnload

	
*/
- (void) viewDidUnload
{
    [lookupButton release];
    lookupButton = nil;
    [UPCTextEntry release];
    UPCTextEntry = nil;
	
    [lookupActivity release];
    lookupActivity = nil;
    [super viewDidUnload];
}


/*******************************************************************************
	viewDidAppear:

	Preps the UPC Text Entry field for editing whenever this view is shown,
	which in turn brings up the keyboard.
*/
- (void) viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

	[UPCTextEntry becomeFirstResponder];
}

/*******************************************************************************
	autoFillButtonHit

	Connected to the "Auto" UIBarButton in the RootViewController.
*/
- (IBAction) autoFillButtonHit:(id)sender
{
	// Fill the field with the UPC for the XBox game GTA 4. Fast demos are good demos.
	UPCTextEntry.text = @"710425390128";
}

/*******************************************************************************
	lookupButtonHit:

	Connected to the "Lookup" UIButton in the RootViewController.
*/
- (IBAction) lookupButtonHit:(id)sender 
{
	if ([productPage findEbayProductForUPC:[UPCTextEntry text]])
	{
		[lookupActivity startAnimating];
		[lookupButton setEnabled:NO];
	}
}

/*******************************************************************************
	redLaserButtonHit:

	Connected to the "RL" UIButton in the RootViewController.
*/
- (IBAction) redLaserButtonHit:(id) sender
{
	// Make a BarcodePickerController
	BarcodePickerController *picker = [[BarcodePickerController alloc] init];
	
	// Set the delegate
	picker.delegate = self;
	
	// Set the overlay
	Overlay *overlay = [[[Overlay alloc] init] autorelease];
	picker.overlay = overlay;
	[overlay setBpc:picker];	

	// Specify which types of barcodes we're looking for
	picker.scanEAN13 = true;
	picker.scanEAN8 = false;
	picker.scanSTICKY = false;
	picker.scanQRCODE = true;
	picker.scanCODE128 = false;
	picker.scanDATAMATRIX = false;
	picker.scanITF = false;
	picker.scanEAN5 = false;
	picker.scanEAN2	= false;
	
	// Show the picker, which will start it scanning.
	[self presentModalViewController:picker animated:YES];
	[picker release];
}

#pragma mark BarcodePickerController delegate

/*******************************************************************************
	barcodePickerController:returnResults:

	Delegate method of the BarcodePickerController. Called after scan session ends.
*/
- (void) barcodePickerController:(BarcodePickerController*)picker returnResults:(NSSet *)results
{
	[self dismissModalViewControllerAnimated:YES];

	// If we scanned multiple results, we'll just set the field twice.
	for (BarcodeResult *result in results)
	{
		if (result.barcodeType == kBarcodeTypeEAN13)
		{
			UPCTextEntry.text = result.barcodeString;
		}

		if (result.barcodeType == kBarcodeTypeQRCODE)
		{
			// If the QR Code is an HTTP URL,
			if ([result.barcodeString hasPrefix:@"http:"])
			{
				// Open a web view with that page.
				NSURL *productURL = [NSURL URLWithString:result.barcodeString];
				[productPage setDestinationURL:productURL];
				[lookupActivity startAnimating];
				break;
			}
		}
	}
}

#pragma mark - ProductWebView delegate

/*******************************************************************************
	webViewBecameReadyToDisplay:

	Delegate method of the ProductWebViewController. Called once a page is loaded.
*/
- (void) webViewBecameReadyToDisplay:(ProductWebViewController *) productWebViewController
{
	[[self navigationController] pushViewController:productWebViewController animated:YES];
	[lookupActivity stopAnimating];
	[lookupButton setEnabled:YES];
}

/*******************************************************************************
	webViewBecameReadyToDisplay:

	Delegate method of the ProductWebViewController. Called if it couldn't load a page.
*/
- (void) webViewFailedToLoad:(ProductWebViewController *) controller;
{
	[lookupActivity stopAnimating];
	[lookupButton setEnabled:YES];
}

@end
