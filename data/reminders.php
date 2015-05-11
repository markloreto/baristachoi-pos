<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');

$type = $_GET['type'];

$columns = array('reminder_id', 'reminder_for', 'reminder_subject', 'reminder_status', 'reminder_start', 'reminder_end');

switch($type) {
    case 'create':
        $result = $result->create('reminders', $columns, $request->models, 'reminder_id');
        break;
    case 'read':
        $result = $result->readJoin('reminders', 'users', $columns, 'reminder_for', 'user_id', 'user_name', $request);
        break;
    case 'update':
        $result = $result->update('reminders', $columns, $request->models, 'reminder_id');
        break;
    case 'destroy':
        $result = $result->destroy('reminders', $request->models, 'reminder_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>