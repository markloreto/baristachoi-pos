<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('item_id', 'item_order_id', 'item_product_id', 'item_qty');

switch($type) {
    case 'create':
        $result = $result->create('items', $columns, $request->models, 'item_id');
        break;
    case 'read':
        $result = $result->read('items', $columns, $request);
        break;
    case 'update':
        $result = $result->update('items', $columns, $request->models, 'order_id');
        break;
    case 'destroy':
        $result = $result->destroy('items', $request->models, 'order_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>