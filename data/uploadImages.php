<?php
function resize($width, $height, $dir){
    /* Get original image x y*/
    list($w, $h) = getimagesize($_FILES['files']['tmp_name']);
    /* calculate new image size with ratio */
    $ratio = max($width/$w, $height/$h);
    $h = ceil($height / $ratio);
    $x = ($w - $width / $ratio) / 2;
    $w = ceil($width / $ratio);
    /* new file name */
    $path = '../images/'.$dir.$width.'x'.$height.'_'.$_FILES['files']['name'];
    /* read binary data from image file */
    $imgString = file_get_contents($_FILES['files']['tmp_name']);
    /* create image from string */

    $image = imagecreatefromstring($imgString);
    $tmp = imagecreatetruecolor($width, $height);

    imagealphablending($tmp, false);
    imagesavealpha($tmp, true);
    $transparent = imagecolorallocatealpha($newImg, 255, 255, 255, 127);
    imagefilledrectangle($newImg, 0, 0, $width, $height, $transparent);

    imagecopyresampled($tmp, $image,
        0, 0,
        $x, 0,
        $width, $height,
        $w, $h);
    /* Save image */
    switch ($_FILES['files']['type']) {
        case 'image/jpeg':
            imagejpeg($tmp, $path, 100);
            break;
        case 'image/png':
            imagepng($tmp, $path, 0);
            break;
        case 'image/gif':
            imagegif($tmp, $path);
            break;
        default:
            exit;
            break;
    }
    return $path;
    /* cleanup memory */
    imagedestroy($image);
    imagedestroy($tmp);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $type = $_GET['type'];
    $dir = $_GET['dir'] . "/";


    if ($type == 'save') {
        resize(400,400, $dir);

    } else if ($type == 'remove') {
        $filename = $_GET['filename'];
        // Delete uploaded files

        for ($index = 0; $index < count($filename); $index++) {
            unlink("../".$filename);
        }

    }

    // Return an empty string to signify success
    echo '';
    exit;
}

?>