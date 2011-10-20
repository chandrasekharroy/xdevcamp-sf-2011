//
//  RootViewController.m
//  QuickScan
//
//  Created by Chall Fry on 9/27/11.
//  Copyright 2011 eBay. All rights reserved.
//

#import "RootViewController.h"

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
	// Fill the field with the UPC for GTA 4. Fast demos are good demos.
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
