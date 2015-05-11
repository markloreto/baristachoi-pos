<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$stmtItems = $db->prepare("SELECT * FROM settings");
$stmtItems->execute(); // 8 = Parts
$settingsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT order_date, order_id, (JulianDay('now') - JulianDay(date(order_date))) AS 'daysDiff' FROM orders WHERE order_user_id = ? ORDER BY order_id DESC LIMIT 1");
$stmtItems->execute(array(intval($_GET["uid"]))); // Last Transaction
$lastTransactionResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT SUM(items.item_qty) AS 'Total Powders' FROM orders, items, products WHERE order_user_id = ? AND orders.order_id = items.item_order_id AND item_product_id = product_id AND product_category IN (".$settingsResult[5]["setting_value"].")");
$stmtItems->execute(array(intval($_GET["uid"]))); // Powders
$powdersResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$totalPowders = ($powdersResult[0]["Total Powders"]) ? intval($powdersResult[0]["Total Powders"]) : 0;

$stmtItems = $db->prepare("SELECT SUM(items.item_qty) AS 'Total Cups' FROM orders, items, products WHERE order_user_id = ? AND orders.order_id = items.item_order_id AND item_product_id = product_id AND product_category IN (".$settingsResult[7]["setting_value"].")");
$stmtItems->execute(array(intval($_GET["uid"]))); // Cups
$cupsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$totalCups = ($cupsResult[0]["Total Cups"]) ? intval($cupsResult[0]["Total Cups"]) : 0;

$stmtItems = $db->prepare("SELECT COUNT(order_status) AS 'Count', order_status, order_id FROM orders WHERE order_user_id = ? AND order_status != 'Paid' GROUP BY order_status");
$stmtItems->execute(array(intval($_GET["uid"]))); // Last Transaction
$statusResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

// income
$monthStart = date("Y-m-d", strtotime("first day of this month"));
$monthEnd = date("Y-m-d", strtotime("last day of this month"));

$stmtItems = $db->prepare("SELECT SUM(items.item_qty) AS 'Total Cups' FROM orders, items, products WHERE order_user_id = ? AND orders.order_id = items.item_order_id AND item_product_id = product_id AND (date(order_date) >= ? AND date(order_date) <= ?) AND product_category IN (".$settingsResult[7]["setting_value"].")");
$stmtItems->execute(array(intval($_GET["uid"]), $monthStart, $monthEnd)); // Net Income
$incomeResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$income = ($incomeResult[0]["Total Cups"]) ? (intval($incomeResult[0]["Total Cups"]) * 2.25) : 0;

$db->commit();

echo json_encode(
    array(
        "Transaction" => $lastTransactionResult[0],
        "Total Powders" => $totalPowders,
        "Total Cups" => $totalCups,
        "Status Result" => $statusResult,
        "Income" => $income
    )
);
//echo $json;
?>