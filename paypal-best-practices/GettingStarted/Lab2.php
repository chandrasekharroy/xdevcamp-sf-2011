<?php

/** GetExpressCheckoutDetails NVP example
 *
 *  Get information about an Express Checkout transaction. 
*/

// flag that will determine whether your api endpoint
// is going to be the sandbox, or the live site
$environment = 'sandbox';	// 'sandbox' or 'live'

/**
 * Send HTTP POST Request
 *
 * This would be a shared low level function
 * through which all of your Express Checkout API calls are made
 *
 * @param	string	The API method name
 * @param	string	The POST Message fields in &name=value pair format
 * @return	array	Parsed HTTP Response body
 */
function PPHttpPost($methodName_, $nvpStr_) {
	global $environment;

	// Set up your API credentials, PayPal end point, and API version.
      // API Credentials come from your PayPal account profile
      // TODO - Replace my_api_username, my_api_password, my_api_signature with your API credentials

	$API_UserName = urlencode('my_api_username');
	$API_Password = urlencode('my_api_password');
	$API_Signature = urlencode('my_api_signature');
	$API_Endpoint = "https://api-3t.paypal.com/nvp";

	if("sandbox" == $environment) {
		$API_Endpoint = "https://api-3t.$environment.paypal.com/nvp";
	}

	// TODO - The PayPal release version to which you are coding ... PayPal just released version 83.0
	$version = urlencode('78.0');

	// Set the curl parameters.
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $API_Endpoint);
	curl_setopt($ch, CURLOPT_VERBOSE, 1);

	// Turn off the server and peer verification (TrustManager Concept).
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1);

	// Set the API operation, version, and API signature in the request.
	$nvpreq = "METHOD=$methodName_&VERSION=$version&PWD=$API_Password&USER=$API_UserName&SIGNATURE=$API_Signature$nvpStr_";

	// Set the request as a POST FIELD for curl.
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nvpreq);

	// Get response from the server.
	$httpResponse = curl_exec($ch);

	if(!$httpResponse) {
		exit('$methodName_ failed: '.curl_error($ch).'('.curl_errno($ch).')');
	}

	// Extract the response details.
	$httpResponseAr = explode("&", $httpResponse);

	$httpParsedResponseAr = array();
	foreach ($httpResponseAr as $i => $value) {
		$tmpAr = explode("=", $value);
		if(sizeof($tmpAr) > 1) {
			$httpParsedResponseAr[$tmpAr[0]] = $tmpAr[1];
		}
	}

	if((0 == sizeof($httpParsedResponseAr)) || !array_key_exists('ACK', $httpParsedResponseAr)) {
		exit("Invalid HTTP Response for POST request($nvpreq) to $API_Endpoint.");
	}

	return $httpParsedResponseAr;
}

/**
 * When executing this within a real payment flow, uncomment the next comment block to get the token from the URL
 * The code assumes that this is the return URL in the SetExpressCheckout API call.
 * The PayPal website redirects the user to this page with a token.
 */

/*
// Obtain the token from PayPal.
if(!array_key_exists('token', $_REQUEST)) {
	exit('Token is not received.');
}

// Set request-specific fields.
// When executing this within a real payment flow, uncomment the next line to get the token from the URL
$token = urlencode(htmlspecialchars($_REQUEST['token']));
*/

// When executing this within a real payment flow, comment the next line which is used to show the GetExpressCheckout call outside of a real payment flow context
$token = urlencode("<TOKEN_GOES_HERE>");

// Add request-specific fields to the request string.
$nvpStr = "&TOKEN=$token";

// Execute the API operation; see the PPHttpPost function above.
$httpParsedResponseAr = PPHttpPost('GetExpressCheckoutDetails', $nvpStr);

// Check for the successful identifiers of the API operation
if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])) {
	// Examples of how to extract the response details.
	$payerID = $httpParsedResponseAr['PAYERID'];
	$street1 = $httpParsedResponseAr["SHIPTOSTREET"];
	if(array_key_exists("SHIPTOSTREET2", $httpParsedResponseAr)) {
		$street2 = $httpParsedResponseAr["SHIPTOSTREET2"];
	}
	$city_name = $httpParsedResponseAr["SHIPTOCITY"];
	$state_province = $httpParsedResponseAr["SHIPTOSTATE"];
	$postal_code = $httpParsedResponseAr["SHIPTOZIP"];
	$country_code = $httpParsedResponseAr["SHIPTOCOUNTRYCODE"];

	exit('Get Express Checkout Details Completed Successfully: '.print_r($httpParsedResponseAr, true));
} else  {
	exit('GetExpressCheckoutDetails failed: ' . print_r($httpParsedResponseAr, true));
}

?>