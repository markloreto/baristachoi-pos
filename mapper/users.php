<?php
ini_set('max_execution_time', 4000);
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$statement = $db->prepare('DELETE FROM users');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="users"');
$statement->execute();
$statement = $db->prepare('VACUUM');
$statement->execute();

$stmt = $b4db->prepare("SELECT * FROM users");
$stmt->execute();

while ($row = $stmt->fetch()) {
    $timestamp = (is_null($row["timestamp"]) || $row["timestamp"] == 0) ? date("Y-m-d\TH:i:s.000\Z", strtotime("now - 1 year")) : date("Y-m-d\TH:i:s.000\Z", $row["timestamp"]);
    $brgy = (is_null($row["brgy"])) ? "" : $row["brgy"];
    $groups = (is_null($row["group"]) || $row["group"] == "") ? 1 : $row["group"];
    //print_r($row);

    $statement = $db->prepare('INSERT INTO users (user_id, user_name, user_address, user_contact, user_group, user_status, user_date, user_photo, user_barangay, user_points)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $statement->execute(array($row["uid"], $row["username"], $row["location"], $row["contact"], $groups, $row["stats"], $timestamp, "images/nophoto.jpg", $brgy, 0));
}

$db->commit();

echo "Done";
?>