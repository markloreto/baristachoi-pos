<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('fee_id', 'fee_name', 'fee_amount', 'fee_order_id');

switch($type) {
    case 'create':
        $result = $result->create('fees', $columns, $request->models, 'fee_id');
        break;
    case 'read':
        $result = $result->read('fees', $columns, $request);
        break;
    case 'update':
        $result = $result->update('fees', $columns, $request->models, 'fee_id');
        break;
    case 'destroy':
        $result = $result->destroy('fees', $request->models, 'fee_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>