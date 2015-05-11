<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$start = date("Y-m-d", strtotime($_POST["reportStart"]));
$end = date("Y-m-d", strtotime($_POST["reportEnd"]));

$db->beginTransaction();

$stmtItems = $db->prepare("SELECT * FROM settings");
$stmtItems->execute(); // 8 = Parts
$settingsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT product_stock AS 'Remaining Stock', product_name AS 'Product Name', product_unit_name AS 'Unit Name',sum(item_qty) AS 'Quantity Sold', product_price AS 'Product Price', product_cost AS 'Product Cost', (sum(item_qty) * (product_price - product_cost)) AS 'Gross Profit', (sum(item_qty) * product_price) AS 'Gross Sales'  FROM orders, items, products WHERE order_id = item_order_id AND item_product_id = product_id AND (date(order_date) >= ? AND date(order_date) <= ?) AND product_category IN (".$settingsResult[5]["setting_value"].") GROUP BY product_id");
$stmtItems->execute(array($start, $end)); // 4 = Powders
$powdersResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT product_stock AS 'Remaining Stock', product_name AS 'Product Name', product_unit_name AS 'Unit Name',sum(item_qty) AS 'Quantity Sold', product_price AS 'Product Price', product_cost AS 'Product Cost', (sum(item_qty) * (product_price - product_cost)) AS 'Gross Profit', (sum(item_qty) * product_price) AS 'Gross Sales'  FROM orders, items, products WHERE order_id = item_order_id AND item_product_id = product_id AND (date(order_date) >= ? AND date(order_date) <= ?) AND product_category IN (".$settingsResult[6]["setting_value"].") GROUP BY product_id");
$stmtItems->execute(array($start, $end)); // 3 = Machines
$machinesResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT product_stock AS 'Remaining Stock', product_name AS 'Product Name', product_unit_name AS 'Unit Name',sum(item_qty) AS 'Quantity Sold', product_price AS 'Product Price', product_cost AS 'Product Cost', (sum(item_qty) * (product_price - product_cost)) AS 'Gross Profit', (sum(item_qty) * product_price) AS 'Gross Sales'  FROM orders, items, products WHERE order_id = item_order_id AND item_product_id = product_id AND (date(order_date) >= ? AND date(order_date) <= ?) AND product_category IN (".$settingsResult[7]["setting_value"].") GROUP BY product_id");
$stmtItems->execute(array($start, $end)); // 5 = Cup
$cupsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT product_stock AS 'Remaining Stock', product_name AS 'Product Name', product_unit_name AS 'Unit Name',sum(item_qty) AS 'Quantity Sold', product_price AS 'Product Price', product_cost AS 'Product Cost', (sum(item_qty) * (product_price - product_cost)) AS 'Gross Profit', (sum(item_qty) * product_price) AS 'Gross Sales'  FROM orders, items, products WHERE order_id = item_order_id AND item_product_id = product_id AND (date(order_date) >= ? AND date(order_date) <= ?) AND product_category IN (".$settingsResult[8]["setting_value"].") GROUP BY product_id");
$stmtItems->execute(array($start, $end)); // 8 = Parts
$partsResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT expenses.expense_description AS 'Description', SUM(expenses.expense_amount) AS 'Total' FROM expenses WHERE (date(expense_date) >= ? AND date(expense_date) <= ?) GROUP BY expense_description");
$stmtItems->execute(array($start, $end)); // 8 = Parts
$expensesResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT fees.fee_name AS 'Name', SUM(fees.fee_amount) AS 'Amount' FROM orders, fees WHERE order_id = fee_order_id AND (date(order_date) >= ? AND date(order_date) <= ?) GROUP BY fee_name");
$stmtItems->execute(array($start, $end)); // 8 = Parts
$feesResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$stmtItems = $db->prepare("SELECT SUM(order_total) AS 'Order Total', SUM(order_net) AS 'Order Net' FROM orders WHERE (date(order_date) >= ? AND date(order_date) <= ?)");
$stmtItems->execute(array($start, $end)); // 8 = Parts
$ordersResult = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

$db->commit();

echo json_encode(
    array(
        "Main Report" =>
            array("Powders Result" => $powdersResult, "Machines Result" => $machinesResult, "Cups Result" => $cupsResult, "Parts Result" => $partsResult),
        "Expenses" => $expensesResult,
        "Fees" => $feesResult,
        "Orders" => array("Total" => $ordersResult)
    )
);
//echo $json;
?>