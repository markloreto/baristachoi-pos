<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


try{
    $b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
    echo "oldVersion";
}catch(Exception $e){
    echo "newVersion";
}
?>