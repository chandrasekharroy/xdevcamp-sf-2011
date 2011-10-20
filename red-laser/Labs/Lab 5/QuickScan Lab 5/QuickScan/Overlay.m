//
//  Overlay.m
//  QuickScan
//
//  Created by Chall Fry on 10/9/11.
//  Copyright 2011 Critical Path Software. All rights reserved.
//

#import "Overlay.h"

@implementation Overlay
@synthesize bpc;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

/*******************************************************************************
	doneButtonHit:

	Connected to the "Done" button in the Overlay nib.
*/
- (IBAction) doneButtonHit:(id)sender 
{
	[bpc doneScanning]; 
}

@end
