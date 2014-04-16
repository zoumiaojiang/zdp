<?php
    require('libs/Smarty.class.php');
    ini_set('display_errors' , "off") ;

    /**
     * merge_array
     * 
     * @param  array  $a src_array
     * @param  array  $b dst_array
     * @return array    result_array
     */
    function merge_array(array $a, array $b)
    {
        foreach($b as $key => $val) {
            if (is_array($val)) {
                $a[$key] = merge_array(isset($a[$key]) ? $a[$key] : array(), $val);
            } else {
                $a[$key] = $val;
            }
        }
        return $a;
    }

    $smarty = new Smarty;
    $module = $argv[1];
    $node_root = $argv[2];
    $tmp_root = $argv[3];

    $data = file_get_contents($module.'/data.json');
    $res = json_decode($data, true);
    $smarty -> template_dir = $node_root.'/templates'; //模板存放目录 
    $smarty -> compile_dir = $tmp_root.'/templates_c'; //编译目录 
    $smarty -> caching = false;
    $smarty -> debugging = false;
    $smarty -> left_delimiter = "{%"; //左定界符 
    $smarty -> right_delimiter = "%}"; //右定界符 

    $tplData = $res['item']['display']['tplData'];
    $extData = $res['item']['display']['extData'];

    $extDataJson = file_get_contents($node_root.'/extData.json');
    $templateConfigJson = file_get_contents($node_root.'/templateConfig.json');
    $queryInfoJson = file_get_contents($node_root.'/queryInfo.json');

    $smarty -> assign('tplData', $tplData);
    $smarty -> assign('templateConfig', json_decode($templateConfigJson, true));
    $smarty -> assign('extData', merge_array(json_decode($extDataJson, true), $extData));
    $smarty -> assign('queryInfo', json_decode($queryInfoJson, true));
    $smarty -> assign('feRoot', '');

    $pagePath = $module.'/page.tpl';
    $pageTpl = file_get_contents($pagePath);
    file_put_contents($tmp_root.'/page.tpl', $pageTpl);
    $smarty -> display($tmp_root.'/page.tpl');
?>