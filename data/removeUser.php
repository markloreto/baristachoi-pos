<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();
$stmt = $db->prepare("DELETE FROM campaign_users WHERE campaign_user_user_id = ?");
$stmt->execute(array(intval($_POST["userId"])));

$stmt = $db->prepare("DELETE FROM reminders WHERE reminder_for = ?");
$stmt->execute(array(intval($_POST["userId"])));

$stmt = $db->prepare("DELETE FROM warranties WHERE warranty_user_id = ?");
$stmt->execute(array(intval($_POST["userId"])));

$db->commit();

?>