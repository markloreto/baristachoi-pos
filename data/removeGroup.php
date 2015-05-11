<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$stmt = $db->prepare("UPDATE users SET user_group = 1 WHERE user_group = ?");
$stmt->execute(array(intval($_POST["groupId"])));

$db->commit();

?>