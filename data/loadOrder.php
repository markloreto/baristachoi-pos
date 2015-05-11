<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$stmt = $db->prepare("SELECT * FROM orders WHERE order_id = ?");
$stmt->execute(array($_POST["orderId"]));
$ordersResult = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT * FROM items, products WHERE item_order_id = ? AND item_product_id = product_id");
$stmtItems->execute(array($_POST["orderId"]));
$itemsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtPayments = $db->prepare("SELECT * FROM payments WHERE payment_order_id = ?");
$stmtPayments->execute(array($_POST["orderId"]));
$paymentsResult = $stmtPayments->fetchAll(PDO::FETCH_ASSOC);

$stmtFees = $db->prepare("SELECT * FROM fees WHERE fee_order_id = ?");
$stmtFees->execute(array($_POST["orderId"]));
$feesResult = $stmtFees->fetchAll(PDO::FETCH_ASSOC);

$db->commit();

echo json_encode(array("main" => $ordersResult, "items" => $itemsResult, "payments" => $paymentsResult, "fees" => $feesResult))
?>