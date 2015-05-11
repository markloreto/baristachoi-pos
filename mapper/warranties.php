<?php
ini_set('max_execution_time', 4000);
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$statement = $db->prepare('DELETE FROM warranties');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="warranties"');
$statement->execute();
$statement = $db->prepare('VACUUM');
$statement->execute();

$stmt = $b4db->prepare("SELECT * FROM members_machine");
$stmt->execute();

while ($row = $stmt->fetch()) {
    $timestamp = date("Y-m-d\TH:i:s.000\Z", strtotime($row["date"]));
    $maintenanceDate = date("Y-m-d\TH:i:s.000\Z", strtotime($row["maintenance_date"]));
    $latlng = ($row["Long"] == "") ? "" : "{". $row["Lat"] . ", " . $row["Long"] . "}";

    //print_r($row);

    $statement = $db->prepare('INSERT INTO warranties (warranty_serial, warranty_user_id, warranty_date_start, warranty_latlong, warranty_photo, warranty_machine_type, warranty_machine_location, warranty_status, warranty_maintenance_date)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $statement->execute(array($row["machine_serial"], $row["uid"], $timestamp, $latlng, "images/noimageproduct.jpg", $row["type"], $row["machine_location"], $row["maintenance_status"], $maintenanceDate));
}

$db->commit();

echo "Done";
?>