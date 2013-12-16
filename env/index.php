<?php
    require('libs/Smarty.class.php');
    ini_set('display_errors' , "off") ;
    $smarty = new Smarty;
    $module = $argv[1];
    $zdp_root = $argv[2];

    $data = file_get_contents($module.'/data.json');
    $res = json_decode($data, true);
    $smarty -> template_dir = $zdp_root.'/templates'; //模板存放目录 
    $smarty -> compile_dir = $zdp_root.'/templates_c'; //编译目录 
    $smarty -> caching = false;
    $smarty -> debugging = false;
    $smarty -> left_delimiter = "{%"; //左定界符 
    $smarty -> right_delimiter = "%}"; //右定界符 

    $smarty -> assign('tplData', $res['item']['display']['tplData']);
    $smarty -> assign('extData', $res['item']['display']['extData']);
    $smarty -> assign('feRoot', '');

    $pagePath = $module.'/page.tpl';
    $pageTpl = file_get_contents($pagePath);
    $pageTpl = preg_replace('/\{%extends.*%\}/', '', $pageTpl);
    file_put_contents ($zdp_root.'/page.tpl', $pageTpl);
    $smarty -> display($zdp_root.'/page.tpl');

?>