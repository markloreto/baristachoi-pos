<?php

$result = $db->query("PRAGMA table_info(products)");
//$result->setFetchMode(PDO::FETCH_OBJ);
$resultCount = $result->fetchAll();
if(count($resultCount) < 12){
    $statement = $db->prepare('ALTER TABLE products ADD COLUMN product_redeem_points INT DEFAULT 0');
    $statement->execute();
}


/*$sql = "SELECT COUNT(*) FROM settings WHERE setting_id = 13";
if ($res = $db->query($sql)) {
    if($res->fetchColumn() == 0){
        $statement = $db->prepare('INSERT INTO product_categories (category_name)  VALUES ("Redeemable Items")');
        $statement->execute();

        $lastId = $db->lastInsertId();

        $statement = $db->prepare('INSERT INTO settings (setting_id, setting_name, setting_value) VALUES (13, "Points Category", ?)');
        $statement->execute(array($lastId));

        $statement = $db->prepare('ALTER TABLE products ADD COLUMN product_redeem_points INT DEFAULT 0');
        $statement->execute();
    }
}*/


?>