<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('campaign_id', 'campaign_subject', 'campaign_start', 'campaign_end');

switch($type) {
    case 'create':
        $result = $result->create('campaigns', $columns, $request->models, 'campaign_id');
        break;
    case 'read':
        //$result = $result->read('campaigns', $columns, $request);
        $result = $result->readJoin('campaigns', 'campaign_users', $columns, 'campaign_id', 'campaign_user_foreign_id', 'campaign_user_user_id', $request);
        break;
    case 'update':
        $result = $result->update('campaigns', $columns, $request->models, 'campaign_id');
        break;
    case 'destroy':
        $result = $result->destroy('campaigns', $request->models, 'campaign_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>