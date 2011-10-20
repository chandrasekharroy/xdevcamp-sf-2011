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
    if (self) 
	{
        // Custom initialization
		floatingLabels = [[NSMutableSet alloc] init];
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

/*******************************************************************************
	barcodePickerController:statusUpdated:

	This method is called by the RedLaser SDK repeatedly while it is running. 
	The status dictionary contains information about the state of the scan session.
*/
- (void) barcodePickerController:(BarcodePickerController*)picker statusUpdated:(NSDictionary*)status
{
	// Add any newly found barcodes to our set of floating labels	
	NSSet *newBarcodes = [status objectForKey:@"NewFoundBarcodes"];
	for (BarcodeResult *newCode in newBarcodes)
	{
		UILabel *newLabel = [[[UILabel alloc] init] autorelease];
		newLabel.text = newCode.barcodeString;
		newLabel.textAlignment = UITextAlignmentCenter; 
		newLabel.lineBreakMode = UILineBreakModeTailTruncation;
		newLabel.numberOfLines = 1;
		newLabel.baselineAdjustment = UIBaselineAdjustmentAlignCenters;
		newLabel.adjustsFontSizeToFitWidth = true;
		newLabel.minimumFontSize = 5;
		newLabel.font = [UIFont systemFontOfSize:36.0];
		newLabel.hidden = true;
				
		if (newCode.barcodeType == kBarcodeTypeQRCODE)
		{
			newLabel.numberOfLines = sqrt([newCode.barcodeString length]) / 2 + 1;
			newLabel.lineBreakMode = UILineBreakModeCharacterWrap;
			newLabel.adjustsFontSizeToFitWidth = false;
			newLabel.font = [UIFont systemFontOfSize:12];
		}				
		[floatingLabels addObject:newLabel];
		[self.view addSubview:newLabel];
	}
	
	// For each floating label
	NSSet *barcodes = [status objectForKey:@"FoundBarcodes"];
	for (UILabel *label in floatingLabels)
	{
		// This finds BarcodeResults that match up with label objects
		NSSet *matchingResults = [barcodes objectsPassingTest: ^BOOL (id obj, BOOL *stop)
				{
					BarcodeResult *barcode = (BarcodeResult *) obj;
					return [label.text isEqualToString:barcode.barcodeString];
				}];
				
		// If we found a BarcodeResult that matches our label
		BarcodeResult *matchingCode = [matchingResults anyObject];
		if (matchingCode)
		{
			// If this barcode hasn't been seen in 1.5 seconds, hide the label
			if ([matchingCode.mostRecentScanTime timeIntervalSinceNow] > -1.5)
			{
				// barcodeLocation is an array of points, with the first point
				// in the array being defined as the top left point of the barcode
				// and the second point in the array defined as the top right point
				// of the barcode. This means if you're looking at the barcode upside
				// down, the first point will be in the lower right, and the second
				// point in the lower left.
				NSMutableArray *array = matchingCode.barcodeLocation;
				label.alpha = 0.5;
				
				if ([array count] != 4)
					continue;
				
				// Calculate the midpoint of the left and right edges of the barcode
				// and put the label between them.
				CGPoint point0 = [[array objectAtIndex:0] CGPointValue];
				CGPoint point1 = [[array objectAtIndex:1] CGPointValue];
				CGPoint point2 = [[array objectAtIndex:2] CGPointValue];
				CGPoint point3 = [[array objectAtIndex:3] CGPointValue];
				CGPoint startPoint = CGPointMake((point0.x + point3.x) / 2,
						(point0.y + point3.y) / 2);
				CGPoint endPoint = CGPointMake((point1.x + point2.x) / 2,
						(point1.y + point2.y) / 2);
				double xdist = endPoint.x - startPoint.x;
				double ydist = endPoint.y - startPoint.y;
				double dist = sqrt(xdist * xdist + ydist * ydist);
				
				CGFloat actualFontSize;
				[label.text sizeWithFont:label.font minFontSize:5.0 actualFontSize:&actualFontSize
						forWidth:dist lineBreakMode:UILineBreakModeTailTruncation];
				CGSize realSize = [label.text sizeWithFont:[UIFont systemFontOfSize:actualFontSize]];
				
				// If it's a QR Code, we're aligning it as a multiline label
				if (matchingCode.barcodeType == kBarcodeTypeQRCODE)
				{
					actualFontSize = 8.0;
					realSize = [label.text sizeWithFont:[UIFont systemFontOfSize:actualFontSize]];
					realSize.height = realSize.height * label.numberOfLines;
				}				
				
				// Apply a transform to the label to put it in the correct place onscreen.
				label.transform = CGAffineTransformIdentity;
				label.frame = CGRectMake(0, 0, dist, realSize.height);
				double radians = acos(xdist / dist);
				if (ydist < 0)
					radians = - radians;
				label.transform = CGAffineTransformMakeRotation(radians);

				if (label.hidden)
				{
					label.center = CGPointMake((startPoint.x + endPoint.x) / 2, 
							(startPoint.y + endPoint.y) / 2);
					label.hidden = false;
				}
				
				// Animate the label towards its correct position to smooth things out
				[UIView animateWithDuration:0.3 delay:0 options:
						UIViewAnimationOptionAllowUserInteraction |
						UIViewAnimationOptionBeginFromCurrentState |
						UIViewAnimationOptionCurveEaseInOut
						animations:^
						{
							label.center = CGPointMake((startPoint.x + endPoint.x) / 2, 
									(startPoint.y + endPoint.y) / 2);
						}
						completion:^(BOOL finished)
						{
						}];

			} else 
			{
				label.hidden = true;
			}
		} else
		{
			label.hidden = true;
		}
	}
		
	// Tell the view we need to redisplay things
	[self.view setNeedsDisplay];
}


@end
