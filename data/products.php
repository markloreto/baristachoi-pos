<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);


$result = new DataSourceResult('sqlite:..//database.db');

echo json_encode($result->read('products', array('product_id', 'product_name', 'product_image', 'product_stock', 'product_unit_name', 'product_price'), $request));

exit;

?>