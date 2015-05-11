<?php
ini_set('max_execution_time', 4000);
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$statement = $db->prepare('DELETE FROM orders');
$statement->execute();
$statement = $db->prepare('DELETE FROM payments');
$statement->execute();
$statement = $db->prepare('DELETE FROM items');
$statement->execute();
$statement = $db->prepare('DELETE FROM fees');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="orders"');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="payments"');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="items"');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="fees"');
$statement->execute();
$statement = $db->prepare('VACUUM');
$statement->execute();

$stmt = $b4db->prepare("SELECT * FROM orders2");
$stmt->execute();


while ($row = $stmt->fetch()) {
    //print_r($row);
    $timestamp = (is_null($row["timestamp"]) || $row["timestamp"] == 0) ? date("Y-m-d\TH:i:s.000\Z", strtotime("now - 1 year")) : date("Y-m-d\TH:i:s.000\Z", $row["timestamp"]);

    $stmtItems = $b4db->prepare("SELECT * FROM items WHERE order_id = ?");
    $stmtItems->execute(array($row["id"]));
    $totalOrder = 0;
    $totalNet = 0;

    while ($row2 = $stmtItems->fetch()) {
        if(intval($row2["product_id"]) == 1){
            if(floatval($row2["price"]) > 0){
                $statement = $db->prepare('INSERT INTO fees (fee_order_id, fee_name, fee_amount)  VALUES (?, ?, ?)');
                $statement->execute(array($row["id"], $row2["product_name"], $row2["price"]));
            }
        }
        else{
            $totalOrder += $row2["qty"] * $row2["price"];
            $totalNet += $row2["qty"] * $row2["net"];
            $statement = $db->prepare('INSERT INTO items (item_order_id, item_product_id, item_qty)  VALUES (?, ?, ?)');
            $statement->execute(array($row["id"], $row2["product_id"], $row2["qty"]));
        }
    }


    $statement = $db->prepare('INSERT INTO orders (order_id, order_total, order_date, order_user_id, order_delivery, order_notes, order_status, order_net, order_cashier)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $statement->execute(array($row["id"], $totalOrder, $timestamp, $row["uid"], $row["delivery"], $row["notes"], ucfirst(strtolower($row["status"])), $totalNet, $row["cashier"]));

    $amountPaid = ($row["amountPaid"] > $totalOrder) ? $totalOrder : $row["amountPaid"];
    $paymentMethod = ($row["paymentMethod"] == "COD") ? "cash" : $row["paymentMethod"];

    $statement = $db->prepare('INSERT INTO payments (payment_order_id, payment_date, payment_type, payment_amount, payment_note)  VALUES (?, ?, ?, ?, ?)');
    $statement->execute(array($row["id"], $timestamp, ucfirst(strtolower($paymentMethod)), $amountPaid, ""));

}
$db->commit();

echo "Done";
?>