<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');
$request = @file_get_contents('php://input');
$request = json_decode($request);

$result = new DataSourceResult('sqlite:..//database.db');
$db = new PDO('sqlite:..//database.db');

$stmtItems = $db->prepare("SELECT * FROM settings");
$stmtItems->execute(); // 8 = Parts
$settingsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$maintenanceValue = intval($settingsResult[9]["setting_value"]);
$voidValue = intval($settingsResult[10]["setting_value"]);

$today = date("Y-m-d", strtotime("now"));
$maintenanceDate = date("Y-m-d", strtotime("now -".$maintenanceValue." days"));

$voidDate = date("Y-m-d", strtotime("now -".($maintenanceValue+$voidValue)." days"));

$stmt = $db->prepare("UPDATE warranties SET warranty_status = 'For Maintenance' WHERE (date(warranty_maintenance_date) >= ? AND date(warranty_maintenance_date) <= ?) AND warranty_status = 'Maintained'");
$stmt->execute(array($maintenanceDate, $today));

$stmt = $db->prepare("UPDATE warranties SET warranty_status = 'Warranty Void' WHERE (date(warranty_maintenance_date) >= ? AND date(warranty_maintenance_date) <= ?) AND warranty_status = 'For Maintenance'");
$stmt->execute(array($voidDate, $maintenanceDate));

$stmt = $db->prepare("UPDATE warranties SET warranty_status = 'Warranty Void' WHERE date(warranty_maintenance_date) <= ? AND warranty_status = 'Maintained'");
$stmt->execute(array($voidDate));

$type = $_GET['type'];

$columns = array('warranty_id', 'warranty_serial', 'warranty_user_id', 'warranty_date_start', 'warranty_latlong', 'warranty_photo', 'warranty_machine_type', 'warranty_machine_location', 'warranty_status', 'warranty_maintenance_date');

switch($type) {
    case 'create':
        $result = $result->create('warranties', $columns, $request->models, 'warranty_id');
        break;
    case 'read':
        //$result = $result->read('warranties', $columns, $request);
        $result = $result->readJoin('warranties', 'users', $columns, 'warranty_user_id', 'user_id', 'user_name', $request);
        break;
    case 'update':
        $result = $result->update('warranties', $columns, $request->models, 'warranty_id');
        break;
    case 'destroy':
        $result = $result->destroy('warranties', $request->models, 'warranty_id');
        break;
}

echo json_encode($result, JSON_NUMERIC_CHECK);

exit;

?>