<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);


$result = new DataSourceResult('sqlite:..//database.db');
$type = $_GET['type'];

$columns = array('product_id', 'product_name', 'product_image', 'product_stock', 'product_unit_name', 'product_price', 'product_cost', 'product_description', 'product_category', 'product_rating', 'product_points', 'product_redeem_points');

switch($type) {
    case 'create':
        $result = $result->create('products', $columns, $request->models, 'product_id');
        break;
    case 'read':
        $result = $result->read('products', $columns, $request);
        break;
    case 'update':
        $result = $result->update('products', $columns, $request->models, 'product_id');
        break;
    case 'destroy':
        $result = $result->destroy('products', $request->models, 'product_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>