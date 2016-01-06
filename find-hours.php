<?php

$doctor = $_GET["doctor"];

$connection = mysqli_connect('localhost',"user","user","menlo");
$sql = "SELECT * FROM `doctors` WHERE `doctor`='" . $doctor . "'";
$result = $connection->query($sql);

while ($array = $result->fetch_assoc()) {
    // Need to look through both vday and fday strings, then total and print the hours.
    
    $vdayhours = 0;
    $vdayseq = explode(";", $array["vday"]);
    
    if ($array["vday"] != "") {
        for ($i = 0; $i < count($vdayseq); $i++) {
            // Implement better method later:

            $commaseq = explode(",", $vdayseq[$i]);
            $nextseq = explode(")", $commaseq[1]);
            $vdayhours += $nextseq[0];
        }
    }
    else {
        $vdayhours = 0;
    }
    
    $fdayhours = 0;
    $fdayseq = explode(";", $array["fday"]);
    
    if ($array["fday"] != "") {
        for ($i = 0; $i < count($fdayseq); $i++) {
            // Implement better method later:

            $commaseq = explode(",", $fdayseq[$i]);
            $nextseq = explode(")", $commaseq[1]);
            $fdayhours += $nextseq[0];
        }
    }
    else {
        $fdayhours = 0;
    }

    echo $vdayhours . "/" . $fdayhours . ",";
}

$connection->close();

?>