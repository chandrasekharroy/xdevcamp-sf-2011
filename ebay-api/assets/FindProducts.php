<?php
//error_reporting(0);

//Code 1.1
include_once "latlong.php";

//Code goes here


//To here


$debug = $_GET['debug'];
$debug2 = $_GET['debug2'];
$debug3 = $_GET['debug3'];
$keyword = $_GET['q'];

//Code goes here



//To here

if($debug == "yes")
{
	header("Content-type: text/xml");
	print_r($strPost);
	exit();
}

//Code 1.2

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
$FindProductsResponseXml = curl_exec($ch);

if($debug2 == "yes")
{
	header("Content-type: text/xml");
	print_r($FindProductsResponseXml);
	exit();
}

//Code 1.3

//Code goes here



//To here
	
print "<pre>";
$ProductArray = $xml[0]->Product;
foreach($ProductArray as $Product)
{
	//Code goes here



	//To here
		
	foreach($ProductIDArray as $ProductID)
	{
		//Code goes here
		
		
		//To here
		
		if ($pidType == 'Reference')
	    $pidType = $pidType.'ID';
		
		//Code goes here
		
		//To here
		
		print  '<a href="'.$url.'">';
		print $Title[0]."</a>";
		print "<br>";
	}
	print "<hr>";
}

print "</pre>";


?>