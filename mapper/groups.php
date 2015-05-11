<?php
ini_set('max_execution_time', 3400);
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$statement = $db->prepare('DELETE FROM groups');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="groups"');
$statement->execute();
$statement = $db->prepare('VACUUM');
$statement->execute();

$stmt = $b4db->prepare("SELECT * FROM user_group");
$stmt->execute();

while ($row = $stmt->fetch()) {
    /*$timestamp = (is_null($row["timestamp"]) || $row["timestamp"] == 0) ? date("Y-m-d\TH:i:s.000\Z", strtotime("now - 1 year")) : date("Y-m-d\TH:i:s.000\Z", $row["timestamp"]);
    $brgy = (is_null($row["brgy"])) ? "" : $row["brgy"];*/
    //print_r($row);

    $statement = $db->prepare('INSERT INTO groups (group_id, group_name)  VALUES (?, ?)');
    $statement->execute(array($row["gid"], $row["gname"]));
}

$db->commit();

echo "Done";
?>