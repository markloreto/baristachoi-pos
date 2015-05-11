<?php
$db = new PDO('sqlite:..//database.db');

$sql = file_get_contents('../reset.sql');

$qr = $db->exec($sql);
?>