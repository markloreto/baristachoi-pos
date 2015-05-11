<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();
$stmt = $db->prepare("DELETE FROM items WHERE item_order_id = ?");
$stmt->execute(array(intval($_POST["orderId"])));

$stmt = $db->prepare("DELETE FROM fees WHERE fee_order_id = ?");
$stmt->execute(array(intval($_POST["orderId"])));

$stmt = $db->prepare("DELETE FROM payments WHERE payment_order_id = ?");
$stmt->execute(array(intval($_POST["orderId"])));
$db->commit();

?>