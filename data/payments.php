<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('payment_id', 'payment_order_id', 'payment_date', 'payment_type', 'payment_amount', 'payment_note');

switch($type) {
    case 'create':
        $result = $result->create('payments', $columns, $request->models, 'payment_id');
        break;
    case 'read':
        $result = $result->read('payments', $columns, $request);
        break;
    case 'update':
        $result = $result->update('payments', $columns, $request->models, 'payment_id');
        break;
    case 'destroy':
        $result = $result->destroy('payments', $request->models, 'payment_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>