<?php
ini_set('max_execution_time', 4000);
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';

$b4db = new PDO('mysql:host=localhost;dbname=baristac_baristachoi', 'root', '');
$db = new PDO('sqlite:..//database.db');

$db->beginTransaction();

function add_S($a, $b){
    if($b > 1)
        return $a."s";
    else
        return $a;
}

$stmt = $b4db->prepare("SELECT rent_to_own.uid AS theUser, rent_to_own.rto_id, rent_to_own.order_id, rent_to_own.daily_payment AS dailyP, orders2.`status` AS stat FROM rent_to_own, orders2 WHERE rent_to_own.order_id = orders2.id");
$stmt->execute();


while ($row = $stmt->fetch()) {
    //print_r($row);
    //$timestamp = (is_null($row["timestamp"]) || $row["timestamp"] == 0) ? date("Y-m-d\TH:i:s.000\Z", strtotime("now - 1 year")) : date("Y-m-d\TH:i:s.000\Z", $row["timestamp"]);

    $statement = $db->prepare('DELETE FROM payments WHERE payment_order_id = ?');
    $statement->execute(array($row["order_id"]));

    $stmtItems = $b4db->prepare("SELECT COUNT(rid) AS weee, paidOn, rid FROM rto_payment WHERE rid = ? GROUP BY paidOn");
    $stmtItems->execute(array($row["rto_id"]));

    while ($row2 = $stmtItems->fetch()) {
        $timestamp = date("Y-m-d\TH:i:s.000\Z", strtotime($row2["paidOn"]));
        $payments = ($row2["weee"] * $row["dailyP"]);
        //echo $timestamp . " - " . ($row2["weee"] * $row["dailyP"]) . " - " . $row2["rid"] . "<br/>";

        $statement = $db->prepare('INSERT INTO payments (payment_order_id, payment_date, payment_type, payment_amount, payment_note)  VALUES (?, ?, ?, ?, ?)');
        $statement->execute(array($row["order_id"], $timestamp, "Cash", $payments, "Payment for Rent to Own"));
    }

    if($row["stat"] == "balance"){
        $statement = $db->prepare('INSERT INTO reminders (reminder_for, reminder_subject, reminder_status, reminder_start)  VALUES (?, ?, ?, ?)');
        $statement->execute(array($row["theUser"], "Payment Reminder for Rent to Own", "Pending", date("Y-m-d\TH:i:s.000\Z", strtotime($timestamp . " +1 day")) ));
    }

}
$db->commit();

echo "Done";
?>