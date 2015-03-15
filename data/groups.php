<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('group_id', 'group_name');

switch($type) {
    case 'create':
        $result = $result->create('groups', $columns, $request->models, 'group_id');
        break;
    case 'read':
        $result = $result->read('groups', $columns, $request);
        break;
    case 'update':
        $result = $result->update('groups', $columns, $request->models, 'group_id');
        break;
    case 'destroy':
        $result = $result->destroy('groups', $request->models, 'group_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>