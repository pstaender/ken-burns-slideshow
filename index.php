<?php
// this is only for development use
// php -S 127.0.0.1:3000 index.php

$images = glob('./images/*.jpg');
$music = glob('./*.mp3');
$music = $music[0] ?? null;

if (php_sapi_name() == 'cli-server') {
    $url = parse_url($_SERVER['REQUEST_URI']);
    if ($url['path'] === '/') {
        $html = file_get_contents('./kenburns.html');
        $html = str_replace('<body class="', '<body class="autoplay ', $html);
        $html = str_replace('<div id="image-wrap">', '<div id="image-wrap">' . implode('', array_map(fn ($a) => "<img src=\"$a\">", $images)), $html);
        if ($music) {
            $html = str_replace('controls loop></audio>', "controls loop src=\"$music\"></audio>", $html);
        }
        exit($html);
    } else if (file_exists("./$url[path]")) {
        return false;
    } else {
        http_response_code(404);
        exit('404: Not found');
    }
}
