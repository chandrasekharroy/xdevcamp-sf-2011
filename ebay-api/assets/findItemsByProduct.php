<?php
//error_reporting(0);

//Code 2.1
$debug = $_GET['debug'];
$debug2 = $_GET['debug2'];
$debug3 = $_GET['debug3'];
$pId = $_GET['pId'];
$pidType = $_GET['pidType'];
$zip = $_GET['zip'];

include_once "latlong.php";

if ($debug == "yes" || $debug2 == "yes"  || $debug3 == "yes")
{
	$pId = 103127916;  //Dummy values to test our code
	$pidType = ReferenceID;
	
}

//Code goes here



//To here

	if ($debug == "yes")
	{
		header("Content-type: text/xml");
		print_r($strPost);
		exit();
	}
	
// Code 2.2

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
	$responseXml = curl_exec($ch);

	if($debug2 == "yes")
	{
		header("Content-type: text/xml");
		print_r($responseXml);
		exit();
	}


//Code 2.3

//Code goes here



//To here
	

	foreach($items as $item)
	{
		//Code goes here

		
		
		


		//To here
		$imageHtml = '<img width="50" height="50"  src="'.$imageUrl.'">';
		
		if($debug3 != "yes")
		{
		
		include_once "GetShippingCosts.php";
		
		$shippingCost = getShippingCost($itemID, $zip);

		}
     $strXML .= '<marker name="'.htmlspecialchars($imageHtml.' : '.$title .' Cost to Ship: '.$shippingCost).'" address="'.$postalCode.'" lat="'.$lat.'" lng="'.$lon.'" distance="'.$distance.'"/>';		
	}
	header('Content-Type:text/xml');
	$strXML .= '</markers>';
	print $strXML;
	

?>