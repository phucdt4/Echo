
#import <Cordova/CDV.h>

#import "CDVForceNetwork.h"

@implementation CDVForceNetwork

- (void)openNetworkSettings:(CDVInvokedUrlCommand*)command
{
    [self openNetworkSettings];
}

- (void)openNetworkSettings
{
    if([[[UIDevice currentDevice] systemVersion] floatValue]>=8.0)
    {
        NSURL *url = [NSURL URLWithString:@"prefs:root=WIFI"];
        [[UIApplication sharedApplication] openURL:url];
    }
}

@end
