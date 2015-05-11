<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$today = date("Y-m-d", strtotime("now"));

$stmtItems = $db->prepare("SELECT SUM(payment_amount) AS 'Total Payments' FROM payments WHERE date(payment_date) = ?");
$stmtItems->execute(array($today)); //
$paymentsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$payments = (count($paymentsResult)) ? floatval($paymentsResult[0]["Total Payments"]) : 0;

$stmtItems = $db->prepare("SELECT SUM(expense_amount) AS 'Total Expenses' FROM expenses WHERE date(expense_date) = ?");
$stmtItems->execute(array($today)); //
$expensesResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$expenses = (count($expensesResult)) ? floatval($expensesResult[0]["Total Expenses"]) : 0;

/*$stmtItems = $db->prepare("SELECT SUM(fee_amount) AS 'Total Fees' FROM orders, fees WHERE date(order_date) = ? AND order_id = fee_order_id");
$stmtItems->execute(array($today)); //
$feesResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$fees = (count($feesResult)) ? floatval($feesResult[0]["Total Fees"]) : 0;*/

$db->commit();

echo json_encode(
    array(
        "Cash On Hand" => $payments - $expenses,
    )
);
//echo $json;
?>