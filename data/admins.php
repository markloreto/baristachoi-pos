<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('admin_id', 'admin_name', 'admin_password', 'admin_role', 'admin_photo');

switch($type) {
    case 'create':
        $result = $result->create('admins', $columns, $request->models, 'admin_id');
        break;
    case 'read':
        $result = $result->read('admins', $columns, $request);
        break;
    case 'update':
        $result = $result->update('admins', $columns, $request->models, 'admin_id');
        break;
    case 'destroy':
        $result = $result->destroy('admins', $request->models, 'admin_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>