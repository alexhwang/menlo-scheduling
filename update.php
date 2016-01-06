<?php
// Inputs: doctor, v-day/f-day, add/remove, tuple to add/remove

$doctor = $_GET["doctor"];
$daytype = $_GET["daytype"];
$action = $_GET["action"];
$newdata = $_GET["newdata"];

$connection = mysqli_connect('localhost',"user","user","menlo");

// Find the existing data:

$sql1 = "SELECT `" . $daytype . "` FROM `doctors` WHERE `doctor`='" . $doctor . "'";
$result1 = $connection->query($sql1);
$row1 = $result1->fetch_assoc();
$existingdata = $row1[$daytype];

// Create the new string:

$newstr = "";
    
if ($action == "add") {
    $newstr = $existingdata . ";" . $newdata;
}    

if ($action == "remove") {
    $strseq = explode(";", $existingdata);
    $seqlength = count($strseq);
    for ($i = 0; $i < $seqlength; $i++) {
        if ($strseq[$i] != $newdata) {
            $newstr = $newstr . ";" . $strseq[$i];
        }
    }
}

// Clean up the leading semicolons on $newstr:

while (substr($newstr, 0, 1) == ";") {
    $newstr = substr($newstr, 1);
}

// Update the MySQL Database:

$sql = "UPDATE `doctors` SET `" . $daytype . "`='" . $newstr . "' WHERE `doctor`='" . $doctor . "'";

$connection->query($sql);
$connection->close();

?>