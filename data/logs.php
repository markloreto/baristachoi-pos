<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('log_id', 'log_type', 'log_flag', 'log_message', 'log_json', 'log_date');

switch($type) {
    case 'create':
        $result = $result->create('logs', $columns, $request->models, 'log_id');
        break;
    case 'read':
        $result = $result->read('logs', $columns, $request);
        break;
    case 'update':
        $result = $result->update('logs', $columns, $request->models, 'log_id');
        break;
    case 'destroy':
        $result = $result->destroy('logs', $request->models, 'log_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>