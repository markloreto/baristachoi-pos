<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$stmt = $db->prepare("UPDATE users SET user_points = user_points - ? WHERE user_id = ?");
$stmt->execute(array(floatval($_POST["points"]), intval($_POST["uid"])));

$stmt = $db->prepare("UPDATE products SET product_stock = product_stock - 1 WHERE product_id = ?");
$stmt->execute(array(floatval($_POST["pid"])));

$db->commit();

/*echo json_encode(
    array(
        "Cash On Hand" => ($payments + $fees) - $expenses,
    )
);*/
//echo $json;
?>