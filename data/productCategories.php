<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('category_id', 'category_name');

switch($type) {
    case 'create':
        $result = $result->create('product_categories', $columns, $request->models, 'category_id');
        break;
    case 'read':
        $result = $result->read('product_categories', $columns, $request);
        break;
    case 'update':
        $result = $result->update('product_categories', $columns, $request->models, 'category_id');
        break;
    case 'destroy':
        $result = $result->destroy('product_categories', $request->models, 'category_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>