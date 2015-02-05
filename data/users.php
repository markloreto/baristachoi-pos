<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);


$result = new DataSourceResult('sqlite:..//database.db');

echo json_encode($result->read('users', array('user_id', 'user_name', 'user_photo', 'user_address', 'user_contact', 'user_group','user_barangay','user_status'), $request));

exit;

?>