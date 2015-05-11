<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$today = date("Y-m-d", strtotime("now"));
$monthStart = date("Y-m-d", strtotime("first day of this month"));
$monthEnd = date("Y-m-d", strtotime("last day of this month"));

$stmtItems = $db->prepare("SELECT COUNT(user_id) AS 'Total Clients' FROM users WHERE date(user_date) <= ? AND date(user_date) >= ?");
$stmtItems->execute(array($monthEnd, $monthStart)); //
$clientResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$clients = (count($clientResult)) ? intval($clientResult[0]["Total Clients"]) : 0;

$db->commit();

echo json_encode(
    array(
        "Total Clients" => $clients,
    )
);
//echo $json;
?>