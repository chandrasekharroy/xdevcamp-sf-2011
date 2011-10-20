/* (c) 2009 eBay Inc. */

#import <UIKit/UIKit.h>

@class RLSampleViewController;

@interface RLSampleAppDelegate : NSObject <UIApplicationDelegate> {
    UIWindow *window;
    RLSampleViewController *viewController;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet RLSampleViewController *viewController;

@end

