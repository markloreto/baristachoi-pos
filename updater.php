<?php
$phpFiles = glob("updates/*.php");
if(count($phpFiles))
    $db = new PDO('sqlite:database.db');

foreach($phpFiles as $phpFile){
    include $phpFile;
    //unlink($phpFile);
}
?>