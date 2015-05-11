<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$stmt = $db->prepare("UPDATE expenses SET expense_login_user = 1 WHERE expense_login_user = ?");
$stmt->execute(array(intval($_POST["adminId"])));

$stmt = $db->prepare("UPDATE orders SET order_cashier = 1 WHERE order_cashier = ?");
$stmt->execute(array(intval($_POST["adminId"])));

$db->commit();

?>