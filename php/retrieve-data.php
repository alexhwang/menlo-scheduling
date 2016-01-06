<?php

$doctor = "";
if (isset($_GET['doctor'])) {
    $doctor = $_GET['doctor'];

    $connection = mysqli_connect('localhost',"user","user","menlo");

    $sql1 = "SELECT `vday` FROM `doctors` WHERE `doctor`='" . $doctor . "'";
    $result1 = $connection->query($sql1);

    $row1 = $result1->fetch_assoc();
    
    
    $sql2 = "SELECT `fday` FROM `doctors` WHERE `doctor`='" . $doctor . "'";
    $result2 = $connection->query($sql2);

    $row2 = $result2->fetch_assoc();
    
    echo $row1["vday"] . "#" . $row2["fday"];
    
    $connection->close();
}
else {
    echo "No doctor specified.";
}

?>