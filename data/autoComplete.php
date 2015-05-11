<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');

//$result = new DataSourceResult('sqlite:..//baristachoi5.db');
$db = new PDO('sqlite:..//database.db');

$result = $db->prepare("SELECT DISTINCT ".$_GET["field"]." FROM ".$_GET["table"]." WHERE ".$_GET["field"]." LIKE :qu LIMIT 0, 20");
$result->execute(array(':qu' => '%'.$_GET['q'].'%'));

$searches = array();

while ($row = $result->fetch()) {
	$searches[] = array("title" => $row[$_GET['field']]);
}


echo json_encode(array("results" => $searches/*, "action" => array("url" => "/path/to/results", "text" => "View all 202 results")*/));
?>