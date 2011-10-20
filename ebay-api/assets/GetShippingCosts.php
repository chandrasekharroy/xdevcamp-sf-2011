<?php
//error_reporting(0);

//Code 3.1

$debug = $_GET['debug'];
$debug2 = $_GET['debug2'];
$debug3 = $_GET['debug3'];

if($debug == "yes" || $debug2 == "yes" || $debug3 == "yes")
{
	//Here we're simply testing getShippingCost by a dummy itemid and a zip code
	getShippingCost(150660130087, 95054);
	exit();
}


function getShippingCost($itemID,$zip){
	
	global $debug, $debug2, $debug3;

	$url = "http://open.api.ebay.com/shopping?";

	//Code goes here



	//To here
	
	if($debug == "yes")
	{
		header("Content-type: text/xml");
		print_r($strPost);
		exit();
	}
	
//Code 3.2	
	//Code goes here



	//To here
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headersArray);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $strPost);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$GetShippingCostsResponseXml = curl_exec($ch);
	
	if($debug2 == "yes")
	{
		header("Content-type: text/xml");
		print_r($GetShippingCostsResponseXml);
		exit();
	}

//Code 3.3
	//Code goes here



	//To here
	
	if($debug3 == "yes")
	{
		echo "This is the cost to ship $ $ShippingServiceCost";
		exit();
	}
	
	return $ShippingServiceCost;
	
}


?>