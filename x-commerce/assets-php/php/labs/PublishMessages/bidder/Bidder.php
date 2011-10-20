<?php
include "avro/avro.php";

function http_request($ch)
{
    $response = curl_exec($ch);
    $error = curl_error($ch);
    $result = array( 'header' => '',
                     'body' => '',
                     'curl_error' => '',
                     'http_code' => '',
                     'last_url' => '');
    if ( $error != "" )
    {
        $result['curl_error'] = $error;
        return $result;
    }
   
    $header_size = curl_getinfo($ch,CURLINFO_HEADER_SIZE);
    $header_block = substr($response, 0, $header_size);
    $allheaders = explode("\r\n", $header_block); // split the header text into lines
    array_shift($allheaders); // drop the first line since that's the HTTP status line
    $headers = array();
    foreach($allheaders as $header) {
    	$splitheader = explode(": ", $header, 2);
    	if (count($splitheader) == 2) {
    		$headers[$splitheader[0]] = $splitheader[1];
    	}
    }
    $result['headers'] = $headers;
    $result['body'] = substr( $response, $header_size );
    $result['http_code'] = curl_getinfo($ch,CURLINFO_HTTP_CODE);
    $result['last_url'] = curl_getinfo($ch,CURLINFO_EFFECTIVE_URL);
    
    if ($result['http_code'] != 200) {
    	$result['curl_error'] = $result['http_code'];
    }
    
    return $result;
}

if ($_POST) {
    $tenant = $_POST["tenant"];
    $listingId = $_POST["listingId"];
    $bidAmount = floatval($_POST["bid"]);

    $bid = array('listingId' => $listingId,
                'bidAmount' => array('amount' => $bidAmount,
                                    'code' => 'USD'));

    $protocol = AvroProtocol::parse(file_get_contents("Auction.avpr"));
    $schemata = $protocol->schemata;
    $schema = new AvroUnionSchema(array("com.x.service.marketplace.message.CurrencyAmount", "com.x.devcamp.auction.Bid"),
            "com.x.devcamp.auction", $schemata, TRUE);
    $strio = new AvroStringIO();
    $dw = new AvroDataIOWriter($strio, new AvroIODatumWriter($schema), $schema);
    $dw->append($bid);
    $dw->close();
    $messageData = $strio->string();

    $tenantAuth = "bidder1" == $tenant ? "QVVUSElELTEAuRyP8LTHzE/oooUzVdZZdQ==" : "QVVUSElELTEAS9f0EZZjuvH+w7wQP/KM1A==";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:8080/bid/placed');
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $messageData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: Bearer $tenantAuth", "Content-Type: avro/binary"));
    $output = http_request($ch);
    curl_close($ch);

    if ($output['curl_error'] != '') {
	    echo "<div class='error'>".$output['curl_error']."</div>";
    } else {
	    echo "<div>Message ".$output['headers']['X-XC-MESSAGE-GUID']." Sent</div>";
    }
}
?>
<html>
<body>
<form method="POST">
<label>Bidder: </label><input name="tenant" type="text" /><br/>
<label>Listing ID: </label><input name="listingId" type="text" /><br/>
<label>Bid Price: </label> $<input name="bid" type="text" /><br/>
<button type="submit">Post Bid</button>
</form>
</body>
</html>

