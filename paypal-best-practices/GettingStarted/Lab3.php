<?php

/** DoExpressCheckoutPayment NVP example
 *
 *  Complete an Express Checkout transaction. 
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

	// setting the curl parameters.
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $API_Endpoint);
	curl_setopt($ch, CURLOPT_VERBOSE, 1);

	// Set the curl parameters.
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
 * The token was returned in the SetExpressCheckout API call response.
 * This payerID was returned in the GetExpressCheckout API call response.
 */

// TODO - Replace payer_id with the payerID that was returned in the GetExpressCheckout API call response.
// TODO - Replace token with the token that was returned in the SetExpressCheckout API call response.
$payerID = urlencode("payer_id");
$token = urlencode("token");

$paymentType = urlencode("Sale");			// or 'Authorization' or 'Order'
$paymentAmount = urlencode("25.42");
$currencyID = urlencode("USD");						// or other currency code ('GBP', 'EUR', 'JPY', 'CAD', 'AUD', etc.)

// Add request-specific fields to the request string.
$nvpStr = "&TOKEN=$token&PAYERID=$payerID&PAYMENTACTION=$paymentType&AMT=$paymentAmount&CURRENCYCODE=$currencyID";

// Execute the API operation; see the PPHttpPost function above.
$httpParsedResponseAr = PPHttpPost('DoExpressCheckoutPayment', $nvpStr);

// Check for the successful identifiers of the API operation
if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])) {
	exit('Express Checkout Payment Completed Successfully: '.print_r($httpParsedResponseAr, true));
} else  {
	exit('DoExpressCheckoutPayment failed: ' . print_r($httpParsedResponseAr, true));
}

?>