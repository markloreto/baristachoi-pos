<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('expense_id', 'expense_date', 'expense_received_by', 'expense_description', 'expense_login_user', 'expense_amount');

switch($type) {
    case 'create':
        $result = $result->create('expenses', $columns, $request->models, 'expense_id');
        break;
    case 'read':
        $result = $result->read('expenses', $columns, $request);
        break;
    case 'update':
        $result = $result->update('expenses', $columns, $request->models, 'expense_id');
        break;
    case 'destroy':
        $result = $result->destroy('expenses', $request->models, 'expense_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>