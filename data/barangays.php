<?php
require_once '../wrappers/php/lib/DataSourceResult.php';
require_once '../wrappers/php/lib/Kendo/Autoload.php';


header('Content-Type: application/json');

//$result = new DataSourceResult('sqlite:..//baristachoi5.db');
$db = new PDO('sqlite:..//database.db');

$arr=[];
$subArray = array();
$i = 1;

$result = $db->prepare("SELECT barangays.`name` AS `Barangay Name`, municipalities.`name` AS `Municipality Name` FROM barangays, municipalities WHERE barangays.`name` LIKE '%".mysql_real_escape_string($_GET['q'])."%' AND barangays.municipality_id = municipalities.id ORDER BY barangays.`name` LIMIT 0, 30");
$result->execute();

$group = array();

foreach ( $result as $value ) {
	$group[$value['Municipality Name']][] = $value;
}

/*var_dump($group);*/

foreach ($group AS $name => $value){
	unset($subArray);
	foreach($value AS $a => $b){
		$subArray[] = array("title" => $b["Barangay Name"], "description" => "test");
	}
	$arr["category".$i] = array("name" => $name, "results" => $subArray);
	$i++;
}

/*foreach($result as $row){
	$municipal = ucwords(strtolower($row["Municipality Name"]));
	//$arr[]=array("category".$i => $municipal.", ".$row["Barangay Name"]);
	$arr[]=array("category".$i => array("name" => $municipal, results => array("title" => $row["Barangay Name"])));
	$i++;
}
*/

echo json_encode(array("results" => $arr));
?>