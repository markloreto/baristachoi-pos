<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$today = date("Y-m-d", strtotime("now"));
$monthStart = date("Y-m-d", strtotime("first day of this month"));
$monthEnd = date("Y-m-d", strtotime("last day of this month"));

$stmtItems = $db->prepare("SELECT COUNT(order_id) AS 'Total Orders' FROM orders WHERE date(order_date) = ?");
$stmtItems->execute(array($today)); //
$orderResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$orders = (count($orderResult)) ? intval($orderResult[0]["Total Orders"]) : 0;

$db->commit();

echo json_encode(
    array(
        "Total Orders" => $orders,
    )
);
//echo $json;
?>