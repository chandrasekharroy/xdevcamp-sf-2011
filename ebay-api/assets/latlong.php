<?php


$address = $_GET['q'];////


// $point = getPoint($address);

// echo $lon = $point[0];
// echo "<br>";
// echo $lat = $point[1];

function getPoint($address) {
    if ($address) {
    	$address = str_replace(" ", "+", $address);
        $url = "http://maps.google.com/maps/geo?q=" . $address . "&output=json&oe=utf8\
&sensor=true_or_false&key=ABQIAAAAbqGgE2W3xBoAdwfSAhci8hQDhjOXsCDmfNyEgDH8ee2fAVmIExSr9uOwvYPrzKyc1f-MgnGeV3L75Q";
       //echo $url;
        $jsonresp = file_get_contents($url);
        $respArray = json_decode($jsonresp,true);
        $placeMark = $respArray['Placemark'][0];
        $pointArray = $placeMark['Point']['coordinates'];
        return $pointArray;
    } else {
        return array(null);
    }
}
/*function dump($logArray) {
    echo "<pre>";
    print_r($logArray);
    echo "</pre>";
}*/
?>
