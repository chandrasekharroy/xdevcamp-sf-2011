<?php

/*
*******************************************************************
IMPORTANT:
When you integrate this code look for TODO as an indication that 
you may need to provide a value or take action before executing this code.
*******************************************************************

*/

//turn php errors on
ini_set("track_errors", true);

//set PayPal Endpoint to sandbox, for the live site simply remove ".sandbox"
$url = trim("https://svcs.sandbox.paypal.com/AdaptivePayments/Pay");

/*
*******************************************************************
TODO - PayPal API Credentials
Replace <API_USERNAME> with your API Username
Replace <API_PASSWORD> with your API Password
Replace <API_SIGNATURE> with your Signature
*******************************************************************
*/

//PayPal API Credentials
$API_UserName = "<API_USERNAME>";
$API_Password = "<API_PASSWORD> ";
$API_Signature = "<API_SIGNATURE>";
	
//Default App ID for Sandbox, always use this value for App ID in sandbox
$API_AppID = "APP-80W284485P519543T";

//Data Binding indicator, you will be using Name-Value pair data binding
$API_RequestFormat = "NV";
$API_ResponseFormat = "NV";

//Create request payload with minimum required parameters
//TODO - Replace <RECEIVER_EMAIL_ACCOUNT> with the receiver's PayPal account email which is the account that is getting paid
$bodyparams = array (	"requestEnvelope.errorLanguage" => "en_US",
											"actionType" => "PAY",
											"currencyCode" => "USD",
											"memo" => "Note in the transaction seen by person paying the money",
											"cancelUrl" => "http://www.paypal.com",
											"receiverList.receiver(0).email" => "<RECEIVER_EMAIL_ACCOUNT>",
											"receiverList.receiver(0).amount" => "20",
											"receiverList.receiver(0).invoiceId" => "123456xyz",
											"returnUrl" => "http://www.paypal.com",
											"trackingId" => "123456xyz"
											);
											
// convert payload array into url encoded query string
$body_data = http_build_query($bodyparams, "", chr(38));


try
{

    //create request and add headers
    $params = array("http" => array( 
    																 "method" => "POST",
                  									 "content" => $body_data,
                  									 "header" =>  "X-PAYPAL-SECURITY-USERID: " . $API_UserName . "\r\n" .
                               										"X-PAYPAL-SECURITY-SIGNATURE: " . $API_Signature . "\r\n" .
                 							 										"X-PAYPAL-SECURITY-PASSWORD: " . $API_Password . "\r\n" .
                   						 										"X-PAYPAL-APPLICATION-ID: " . $API_AppID . "\r\n" .
                   						 										"X-PAYPAL-REQUEST-DATA-FORMAT: " . $API_RequestFormat . "\r\n" .
                  						 										"X-PAYPAL-RESPONSE-DATA-FORMAT: " . $API_ResponseFormat . "\r\n" 
                  																));


    //create stream context
     $ctx = stream_context_create($params);
    

    //open the stream and send request
     $fp = @fopen($url, "r", false, $ctx);

    //get response
  	 $response = stream_get_contents($fp);

  	//check to see if stream is open
     if ($response === false) {
        throw new Exception("php error message = " . "$php_errormsg");
     }
           
    //close the stream
     fclose($fp);

    //parse the ap key from the response
    $keyArray = explode("&", $response);
        
    foreach ($keyArray as $rVal){
    	list($qKey, $qVal) = explode ("=", $rVal);
			$kArray[$qKey] = $qVal;
    }
       
    //set url to approve the transaction
    $payPalURL = "https://www.sandbox.paypal.com/webscr?cmd=_ap-payment&paykey=" . $kArray["payKey"];

    // print the url to screen for testing purposes
    // Remove this if-else block to proceed with the PayPal.com flow
    If ( $kArray["responseEnvelope.ack"] == "Success") {
    	echo '<p><a href="' . $payPalURL . '" target="_blank">' . $payPalURL . '</a></p>';
     }
    else {
    	echo 'ERROR Code: ' .  $kArray["error(0).errorId"] . " <br/>";
      echo 'ERROR Message: ' .  urldecode($kArray["error(0).message"]) . " <br/>";
    }
   
    // Normally we would redirect the buyer to PayPal.com
    // The code is commented out so that we can simply look at the response data in our first iteration
    // Once ready to proceed with the PayPal.com flow we uncomment the next comment block

    /*
    If ( $kArray["responseEnvelope.ack"] == "Success") {
   
  	  header("Location:".  $payPalURL);
      exit;
       }
     else {
     		echo 'ERROR Code: ' .  $kArray["error(0).errorId"] . " <br/>";
        echo 'ERROR Message: ' .  urldecode($kArray["error(0).message"]) . " <br/>";
     }
     */
}

catch(Exception $e) {
  	echo "Message: ||" .$e->getMessage()."||";
  }

?>
