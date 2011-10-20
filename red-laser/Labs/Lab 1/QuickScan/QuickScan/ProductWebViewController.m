//
//  ProductWebViewController.m
//  QuickScan
//
//  Created by Chall Fry on 9/29/11.
//  Copyright 2011 Critical Path Software. All rights reserved.
//

#import "ProductWebViewController.h"

#include <libxml/tree.h>
#include <libxml/parser.h>
#include <libxml/xpath.h>
#include <libxml/xpathInternals.h>

@interface ProductWebViewController ()
- (NSString *) stringFromXMLContext:(xmlXPathContextPtr) searchContext atPath:(char *) path;
- (void) parseFindProductsResults:(NSString *) resultString;
@end


@implementation ProductWebViewController
@synthesize productView;
@synthesize delegate;

/*******************************************************************************
	initWithURL:

	
*/
- (id) init
{
	if ((self = [super initWithNibName:nil bundle:nil]))
	{
		initialPageLoaded = false;
		self.title = @"Product View";
    }
	
    return self;
}

/*******************************************************************************
	dealloc

	
*/
- (void) dealloc 
{
	if ([self isViewLoaded])
	{
		[self viewDidUnload];
	}
	
	[delegate release];
	[destURL release];
    [super dealloc];
}

#pragma mark - View lifecycle

/*******************************************************************************
	viewDidUnload

	
*/
- (void) viewDidUnload
{
    [self setProductView:nil];
    [super viewDidUnload];
}

#pragma mark - URL Loading

/*******************************************************************************
	findEbayProductForUPC:

	
*/
- (bool) findEbayProductForUPC:(NSString *) upcText
{
	NSString *urlString = [NSString stringWithFormat:
			@"http://open.api.sandbox.ebay.com/shopping?callname=FindProducts&responseencoding=XML"
			@"&appid=ChallFry-c942-471a-a6f4-2619f135465d&siteid=0&ProductID.type=UPC"
			@"&ProductID.Value=%@&version=737", upcText];
	
	NSURL *lookupURL = [NSURL URLWithString:urlString];
	NSURLRequest *request = [NSURLRequest requestWithURL:lookupURL];
	NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
	if (!connection)
	{
		NSLog(@"Couldn't make a network connection; how's the demo going?");
		return false;
	}
	[response release];
	response = nil;
	responseData = [[NSMutableData alloc] init];

	return true;
}

/*******************************************************************************
	setDestinationURL:

	Setting the destination URL kicks off loading of the URL. Since the load is
	done by a view in the nib file, we force-load the nib if necessary.
*/
- (void) setDestinationURL:(NSURL *) url
{
	if (destURL)
		[destURL release];
	destURL = [url retain];
	
	// Force-load our nib...
	if (![self isViewLoaded])
	{
		[self view];
	}
	[productView setDelegate:self];
	productView.scalesPageToFit = true;
	initialPageLoaded = false;
	
	// So we can tell the web view to start loading
	NSURLRequest *request = [NSURLRequest requestWithURL:destURL];
	[productView loadRequest:request];
}

/*******************************************************************************
	webViewDidFinishLoad:

	Called when the web view has finished loading a page.
*/
- (void) webViewDidFinishLoad:(UIWebView *)webView
{
	if (delegate && !initialPageLoaded)
	{
		initialPageLoaded = true;
		[delegate webViewBecameReadyToDisplay:self];
	}
}

#pragma mark - URLConnection Delegate

/*******************************************************************************
	connection:didReceiveResponse:

	Generally, this gets called when the connection has received the headers for the
	response packet. In some cases, this can be called multiple times for a single 
	connection.
*/
- (void) connection:(NSURLConnection *)connection didReceiveResponse:(NSHTTPURLResponse *)resp
{
	response = [resp retain];
    [responseData setLength:0];
}

/*******************************************************************************
	connection:didReceiveData:

	
*/
- (void) connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    [responseData appendData:data];
}

/*******************************************************************************
	connection:didFailWithError:

	
*/
- (void) connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
	NSString *messageStr = [NSString stringWithFormat:
			@"NSURLConnection failed when trying to talk to the eBay API. %@", [error localizedDescription]];

	// Show an alert
	UIAlertView	*alert = [[[UIAlertView alloc] initWithTitle:@"Network Error"
			message:messageStr delegate:nil cancelButtonTitle:@"That's not good" 
			otherButtonTitles:nil] autorelease];
	[alert show];
	[delegate webViewFailedToLoad:self];
}

/*******************************************************************************
	connectionDidFinishLoading:

	
*/
- (void) connectionDidFinishLoading:(NSURLConnection *)connection
{ 
	NSString *resultString;

	NSString *textEncodingName = [response textEncodingName];
	if (textEncodingName)
	{
		NSStringEncoding encoding = CFStringConvertEncodingToNSStringEncoding(
				CFStringConvertIANACharSetNameToEncoding((CFStringRef) textEncodingName));
		resultString = [[[NSString alloc] initWithData:responseData encoding:encoding] autorelease];
	} else
	{
		// Assume it's UTF8
		resultString = [[[NSString alloc] initWithData:responseData encoding:
				NSUTF8StringEncoding] autorelease];
	}
	[responseData release];
	
	[self parseFindProductsResults:resultString];
}

#pragma mark - Parsing

/*******************************************************************************
	parseFindProductsResults:

	The structure for the XML returned from FindProducts may be found at:
	http://developer.ebay.com/DevZone/shopping/docs/CallRef/FindProducts.html
*/
- (void) parseFindProductsResults:(NSString *) resultString
{
	xmlInitParser();
	
    xmlDocPtr doc;
    xmlXPathContextPtr searchContext; 
    
    doc = xmlReadMemory([resultString UTF8String], 
			[resultString lengthOfBytesUsingEncoding:NSUTF8StringEncoding], "", NULL, 0);
	NSAssert(doc, @"Couldn't make an XML Doc out of the eBay server's response.");
    searchContext = xmlXPathNewContext(doc);
	NSAssert(searchContext, @"Somehow we failed to make a search context for an XML Doc.");
	
	NSAssert(!xmlXPathRegisterNs(searchContext, (xmlChar *) "eBay",
			(xmlChar *) "urn:ebay:apis:eBLBaseComponents"), 
			@"Got an error when registering namespaces for XPath");

	// Did the call succeed?
	NSString *ackString = [self stringFromXMLContext:searchContext atPath:
			"/eBay:FindProductsResponse/eBay:Ack/text()"];
	if (![ackString isEqualToString:@"Success"])
	{
		// Get the fail string
		NSString *errorString = [self stringFromXMLContext:searchContext atPath:
				"/eBay:FindProductsResponse/eBay:Errors/eBay:LongMessage/text()"];
		if (!errorString)
			errorString = @"Failure response from FindProducts.";
		
		// Show an alert
		UIAlertView	*alert = [[[UIAlertView alloc] initWithTitle:@"FindProducts Error"
				message:errorString delegate:nil cancelButtonTitle:@"Uh oh" 
				otherButtonTitles:nil] autorelease];
		[alert show];
		[delegate webViewFailedToLoad:self];
	} else
	{	
		// Get the URL of the product details page
		NSString *productString = [self stringFromXMLContext:searchContext atPath:
				"/eBay:FindProductsResponse/eBay:Product[1]/eBay:DetailsURL/text()"];
		if (!productString)
		{
			// I think this won't ever happen. 
			UIAlertView	*alert = [[[UIAlertView alloc] initWithTitle:@"FindProducts Error"
					message:@"Could not find URL for product details." delegate:nil 
					cancelButtonTitle:@"Uh oh" otherButtonTitles:nil] autorelease];
			[alert show];
			[delegate webViewFailedToLoad:self];
		} else
		{
			// Open a web view with that page.
			NSURL *productURL = [NSURL URLWithString:productString];
			[self setDestinationURL:productURL];
		}
	}

    xmlXPathFreeContext(searchContext); 
    xmlFreeDoc(doc); 
}

/*******************************************************************************
	stringFromXMLContext:atPath:

	Utility method to pull a string out of a XML document. 
*/
- (NSString *) stringFromXMLContext:(xmlXPathContextPtr) searchContext atPath:(char *) path
{
    xmlXPathObjectPtr xpathObj; 
	
	// Eval the xpath expression, giving us a set of nodes that match.
	xpathObj = xmlXPathEvalExpression((xmlChar *) path, searchContext);
	if (xmlXPathNodeSetIsEmpty(xpathObj->nodesetval))
	{
		return nil;
	}
	
	// Here, we really just want the text string from the 
	xmlNodePtr node = xpathObj->nodesetval->nodeTab[0];
	return [NSString stringWithUTF8String:(char *) node->content];
}


@end
