<?php
ini_set('max_execution_time', 3400);
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$statement = $db->prepare('DELETE FROM expenses');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="expenses"');
$statement->execute();
$statement = $db->prepare('VACUUM');
$statement->execute();

$stmt = $b4db->prepare("SELECT * FROM expenses");
$stmt->execute();

while ($row = $stmt->fetch()) {
    $timestamp = date("Y-m-d\TH:i:s.000\Z", strtotime($row["date"]));

    //print_r($row);

    $statement = $db->prepare('INSERT INTO expenses (expense_date, expense_received_by, expense_description, expense_login_user, expense_amount)  VALUES (?, ?, ?, ?, ?)');
    $statement->execute(array($timestamp, $row["receivedBy"], $row["description"], $row["user"], $row["amount"]));
}

$db->commit();

echo "Done";
?>