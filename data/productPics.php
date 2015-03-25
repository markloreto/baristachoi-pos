<?php
/*if ($handle = opendir('../images/profile/')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            $pics[] = array("filename" => $entry);
        }
    }
    closedir($handle);
}*/


//echo json_encode($pics);

$files = glob('../images/products/*.*');
usort($files, function($a, $b) {
    return filemtime($a) < filemtime($b);
});

foreach($files as $key => $value){
    $pics[] = array("filename" => str_replace("../","", $value));
}
echo json_encode($pics);
?>