<?php
include "avro/avro.php";

function getHeaderValue($headerName) {
    $headers = getallheaders();
    $value = NULL;
    if (array_key_exists($headerName, $headers)) {
        $value = $headers[$headerName];
    }
    return $value;
}
function getMessageObject($data) {
    $read_io = new AvroStringIO($data);
    $data_reader = new AvroDataIOReader($read_io, new AvroIODatumReader());
 
    $results = array();
    foreach ($data_reader->data() as $datum) {
      array_push($results, $datum);
    }
    return $results;
}
if (getHeaderValue("Authorization") != "Bearer QlVTRk9SQVVUSElELTEA7/GRzPeAKiymgVsONHEikg==") {
    header("HTTP/1.0 401 Unauthorized");
    exit();
}
$tenant = getHeaderValue("X-XC-TENANT-ID");
$messageGuid = getHeaderValue("X-XC-MESSAGE-GUID");
$post_data = file_get_contents("php://input");
$messages = getMessageObject($post_data);
$topic = substr($_SERVER['REQUEST_URI'], strlen("/bidder"));
$logMessage = "[$messageGuid][$tenant] $topic:";
if (strpos($topic, "/auction/") === 0) {
        $listing = $messages[0];
        $logMessage .= $listing["xId"].":".$listing["title"]." -- $".$listing["price"]["amount"];
} else if (strpos($topic, "/bid/") === 0) {
        $bid = $messages[0];
        $logMessage .= $bid["listingId"]." -> $".$bid["bidAmount"]["amount"];
} else {
        $logMessage .= "Rogue Message";
}
file_put_contents("auction_log", $logMessage."\n", FILE_APPEND);

?>
