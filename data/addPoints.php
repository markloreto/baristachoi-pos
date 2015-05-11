<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$stmt = $db->prepare("UPDATE users SET user_points = user_points + ? WHERE user_id = ?");
$stmt->execute(array(floatval($_POST["points"]), intval($_POST["uid"])));

$db->commit();

/*echo json_encode(
    array(
        "Cash On Hand" => ($payments + $fees) - $expenses,
    )
);*/
//echo $json;
?>