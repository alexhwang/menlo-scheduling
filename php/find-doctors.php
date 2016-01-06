<?php

$connection = mysqli_connect('localhost',"user","user","menlo");
$sql = "SELECT * FROM `doctors` WHERE 1";
$result = $connection->query($sql);

while ($array = $result->fetch_assoc()) {

    echo $array["doctor"] . ",";
}

$connection->close();

?>