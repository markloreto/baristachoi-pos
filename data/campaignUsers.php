<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('campaign_user_id', 'campaign_user_foreign_id', 'campaign_user_user_id', 'campaign_user_join_date');

switch($type) {
    case 'create':
        $result = $result->create('campaign_users', $columns, $request->models, 'campaign_user_id');
        break;
    case 'read':
        //$result = $result->read('orders', $columns, $request);
        $result = $result->readJoin('campaign_users', 'users', $columns, 'campaign_user_user_id', 'user_id', 'user_name', $request);
        break;
    case 'update':
        $result = $result->update('campaign_users', $columns, $request->models, 'campaign_user_id');
        break;
    case 'destroy':
        $result = $result->destroy('campaign_users', $request->models, 'campaign_user_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>