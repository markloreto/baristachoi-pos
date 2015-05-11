<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('user_id', 'user_name', 'user_photo', 'user_address', 'user_contact', 'user_group','user_barangay','user_status','user_date', 'user_points');

switch($type) {
    case 'create':
        $result = $result->create('users', $columns, $request->models, 'user_id');
        break;
    case 'read':
        $result = $result->read('users', $columns, $request);
        break;
    case 'update':
        $result = $result->update('users', $columns, $request->models, 'user_id');
        break;
    case 'destroy':
        $result = $result->destroy('users', $request->models, 'user_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>