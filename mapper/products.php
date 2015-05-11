<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

$statement = $db->prepare('DELETE FROM products');
$statement->execute();
$statement = $db->prepare('delete from sqlite_sequence where name="products"');
$statement->execute();
$statement = $db->prepare('VACUUM');
$statement->execute();

$stmt = $b4db->prepare("SELECT * FROM product");
$stmt->execute();

while ($row = $stmt->fetch()) {
    /*$timestamp = (is_null($row["timestamp"]) || $row["timestamp"] == 0) ? date("Y-m-d\TH:i:s.000\Z", strtotime("now - 1 year")) : date("Y-m-d\TH:i:s.000\Z", $row["timestamp"]);
    $brgy = (is_null($row["brgy"])) ? "" : $row["brgy"];*/
    //print_r($row);

    $statement = $db->prepare('INSERT INTO products (product_id, product_name, product_image, product_stock, product_unit_name, product_price, product_cost, product_description, product_category, product_rating, product_points)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $statement->execute(array($row["pid"], $row["pname"], "images/noimageproduct.jpg", $row["stocks"], $row["unit_name"], $row["price"], $row["cost"], $row["pdescription"], $row["pcategory"], 0, 0));
}

$db->commit();

echo "Done";
?>