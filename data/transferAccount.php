<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();
$stmt = $db->prepare("UPDATE orders SET order_user_id = ? WHERE order_user_id = ?");
$stmt->execute(array(intval($_POST["to"]), intval($_POST["from"])));

$stmt = $db->prepare("UPDATE campaign_users SET campaign_user_user_id = ? WHERE campaign_user_user_id = ?");
$stmt->execute(array(intval($_POST["to"]), intval($_POST["from"])));

$stmt = $db->prepare("UPDATE reminders SET reminder_for = ? WHERE reminder_for = ?");
$stmt->execute(array(intval($_POST["to"]), intval($_POST["from"])));

$stmt = $db->prepare("UPDATE warranties SET warranty_user_id = ? WHERE warranty_user_id = ?");
$stmt->execute(array(intval($_POST["to"]), intval($_POST["from"])));

$stmt = $db->prepare("DELETE FROM users WHERE user_id = ?");
$stmt->execute(array(intval($_POST["from"])));
$db->commit();

?>