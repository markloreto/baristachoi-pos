<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');
$stmt = $db->prepare("DELETE FROM logs");
$stmt->execute();

?>