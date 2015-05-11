<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');

//$result = new DataSourceResult('sqlite:..//baristachoi5.db');
$db = new PDO('sqlite:..//database.db');

$arr=[];
$subArray = array();
$i = 0;

$result = $db->prepare("SELECT barangays.`name` AS `Barangay Name`, municipalities.`name` AS `Municipality Name` FROM barangays, municipalities WHERE barangays.`name` LIKE :qu AND barangays.municipality_id = municipalities.id ORDER BY municipalities.`name` ASC LIMIT 0, 1000");
$result->execute(array(':qu' => '%'.$_GET['q'].'%'));

$group = array();

foreach ( $result as $value ) {
	$group[$value['Municipality Name']][] = $value;
}

/*var_dump($group);*/

foreach ($group AS $name => $value){
	unset($subArray);
	$name = ucwords(strtolower($name));
	foreach($value AS $a => $b){
		$subArray[] = array("title" => $b["Barangay Name"], "description" => "", "municipal" => $name);
	}
	$arr["category".$i] = array("name" => $name, "results" => $subArray);
	$i++;
}


echo json_encode(array("results" => $arr/*, "action" => array("url" => "/path/to/results", "text" => "View all 202 results")*/));
?>