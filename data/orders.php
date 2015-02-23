<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('order_id', 'order_total', 'order_date', 'order_user_id', 'order_delivery', 'order_notes', 'order_status', 'order_method', 'order_net', 'order_cashier');

switch($type) {
    case 'create':
        $result = $result->create('orders', $columns, $request->models, 'order_id');
        break;
    case 'read':
        $result = $result->read('orders', $columns, $request);
        break;
    case 'update':
        $result = $result->update('orders', $columns, $request->models, 'order_id');
        break;
    case 'destroy':
        $result = $result->destroy('orders', $request->models, 'order_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>