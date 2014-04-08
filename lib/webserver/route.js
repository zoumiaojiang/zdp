/*
 * @file 开发时请求转发中心
 * @author johnson[zoumiaojiang@gmail.com]
 */

var http = require('http');
var fs = require('fs');
var path = require('path');
var utils = require('../utils');

/**
 * 代理服务器的配置
 * 
 * @inner
 * @type {Object}
 */
var proxy = {};
var lor = 'left';
var ZDP_SERVER_CONFIG = 'zdp-config';

/**
 * 得到配置数据
 *
 * @inner
 * @param  {string} file 配置文件名
 * @return {Object}      得到的配置文件内容
 */
function getConf(file) {

    var filePath = path.resolve(process.cwd(), file + '.js');

    if (!fs.existsSync(filePath)) {
        console.log(
            ' ----Can\'t found `%s` in `%s`', 
            file + '.js', 
            process.cwd()
        );
        process.exit(1);
    }

    return require(filePath).getConfig();
}

/**
 * 替换pad环境所需的真实js依赖
 * @param  {string} str 
 * @return {[type]}     [description]
 */
function replaceStatic(str) {
    return str.replace(
        'http://s1.bdstatic.com/r/www/cache/pad/global/js/jquery-2.0.3.min.js',
        'http://s1.bdstatic.com/r/www/cache/pad/global/js/zepto-min-1.0.0.js'
    ).replace(
        'http://s1.bdstatic.com/r/www/cache/pad/global/js/mobile-1.0.29.js',
        'http://s1.bdstatic.com/r/www/cache/pad/global/js/mobile-1.0.28.js'
    ).replace(
        'http://s1.bdstatic.com/r/www/cache/aladdin-pad/common.js',
        'http://s1.bdstatic.com/r/www/cache/aladdin-pad/base-1.5.js'
    ).replace(
        'http://s1.bdstatic.com/r/www/cache/pad/js/login/login-1.0.4.js',
        'http://s1.bdstatic.com/r/www/cache/pad/js/login/login-1.0.2.js'
    ).replace(
        'http://s1.bdstatic.com/r/www/cache/pad/js/page/page-1.0.20.js',
        'http://s1.bdstatic.com/r/www/cache/pad/js/page/page-1.0.18.js'
    );
}

/**
 * 请求重定向，注入自定义内容
 *
 * @inner
 * @param  {Object} res     请求返回的对象
 * @param  {string} content 注入内容
 * @param  {Object} conf    配置信息
 */
function redirect(res, content, dsp) {
    var config = getConf(ZDP_SERVER_CONFIG); 
        proxy = config.proxy;

    if (content === '') {
        content = ''
            + '<p style="color:red; font-size:13px;">'
            +     'smarty模板编译出错，请仔细检查模板！！'
            + '</p>';
    }
    var redireRequest = http.request(proxy, function (resp) {

        var all = [];

        resp.setEncoding('utf8');
        
        resp.on('data', function (chunk) {
            all.push(chunk);
        });

        resp.on('end', function () {

            var data = all.join('');
            var template = ''
                +'<div class="result-op" srcid="29093" id="1" tpl="ecl_edu_orgname" '
                +         ' mu="http://nourl.baidu.com/29093" '
                +         ' data-op="{&quot;y&quot;:&quot;FF9DF67E&quot;}" '
                +         ' data-click="{'
                +               '&quot;p1&quot;:&quot;1&quot;,'
                +               '&quot;rsv_bdr&quot;:&quot;0&quot;,'
                +               '&quot;p5&quot;:1'
                +         '}"'
                +         ' style="margin-bottom:20px;"'
                +     '>' + content + '</div>'
                +     '<script>console.timeEnd("renderTime")</script>' 

            if (dsp && dsp === 'ipad') {
                if (content !== 'null' && lor === 'left') {
                    data = data.replace('<article id="bds-container">',
                          '<script>console.time("renderTime")</script>'
                        + '<article id="bds-container">' + template
                    );
                    data = replaceStatic(data);
                }
                else if(content !== 'null' && lor === 'right') {
                    data = data.replace('<aside id="bds-right-ads"> '
                        +'<table cellpadding="0" cellspacing="0"><tr> '
                        +   '<td align="left" style="border-left:1px solid #e1e1e1">',
                          '<script>console.time("renderTime")</script>'
                        + '<aside id="bds-right-ads"> '
                        +   '<table cellpadding="0" cellspacing="0"><tr> '
                        +       '<td align="left" style="border-left:1px solid #e1e1e1">'
                        + '<div style="margin-left: 10px;">' 
                        + template
                        + '</div>'
                    );
                    data = replaceStatic(data);
                }
            }
            else {
                if (content !== 'null' && lor === 'left') {
                    data = data.replace('<div id="content_left">',
                          '<script>console.time("renderTime")</script>'
                        + '<div id="content_left">'+ template
                    );
                }
                else if(content !== 'null' && lor === 'right') {
                    data = data.replace('<div id="content_right" class="cr-offset">',
                          '<script>console.time("renderTime")</script>'
                        + '<div id="content_right" class="cr-offset">' + template
                    );
                }
            }
            res.send(data);
        });
    });
    redireRequest.on( 'error', function (e) {
        console.log(' ----Error in request: ' + e.message);
    });

    redireRequest.end();

}

/**
 * 调用PHP Smarty返回的内容
 * 
 * @param  {Object} res http 请求对象
 * @param  {string} mod 当前所调试的卡片模块
 */
function linkPHPToNode(res, mod, dsp) {

    /**
     * 将php解析后的结果填充到context中
     * 
     * @param  {string}   statuscode 返回的状态码
     * @return {Any}            当出错的时候才返回空
     */
    function status(statuscode) {
        if (statuscode === undefined) {
            return;
        }
        redirect(res, bodyBuffer.join(''), dsp);
    }

    var child = require('child_process').spawn (
        'php', [
            path.resolve(__dirname, '../../env/index.php'), 
            path.resolve(process.cwd(), './page/' +  mod),
            path.resolve(__dirname, '../../tmp'),
            utils.getTmpDir()
        ]
    );
    var bodyBuffer = [];
    
    child.on('exit', status);
    
    child.stdout.on('end', status);
    
    child.stdout.on('data', function (data) {
        bodyBuffer.push(data);
    });
}

/**
 * 返回当找不到zdp-config.js的配置文件的时候的提示信息
 * 
 * @return {string} 信息内容
 */
function printerr() {
    return ''
        + '<p style="'
        +   'line-height: 50px;'
        +   'text-align: center;'
        +   'color:red; '
        +   'font-size: 30px; '
        +   'margin-top: 30px; '
        +   'font-family:\'Century Gothic\',Arial,\'Microsoft Yahei\';">'
        +       'This is a error page about zdp-config.js,<br/> '
        +       'See more information in command `zdp help`'
        + '</p>';
}

/**
 * 通过请求中的wd参数进行对应转发
 * 
 * @return {Object} req  http 请求对象
 * @param {Object} res   http响应对象 
 */
function transmitByKey(req, res) {

    var config = getConf(ZDP_SERVER_CONFIG);
    var wd = req.query['wd'] || '';
    var module = '';
    var dsp = req.query['dsp'];


    proxy.path = req._parsedUrl.path;
    
    if (config.vsp) {
        config.vsp.forEach ( function (item) {
            item.querys = item.querys || [];
            item.querys.forEach ( function (query) {
                if (query === wd) {
                    module = item.tpl;
                    lor = item.lor || 'left';
                    if (lor !== 'left' && lor !== 'right') {
                        lor = 'left';
                    }
                }
            });
        });
    }
    else {
        res.send(' ----WARM! `zdp-config.js` file has Error!');
    }
    module ? linkPHPToNode(res, module, dsp) : redirect(res, 'null');
}


/**
 * route入口
 * 
 * @param  {Object} req 请求对象
 * @param  {Object} res 返回对象
 */
exports.index = function (req, res) {
    var configPath = path.resolve(process.cwd(), './zdp-config.js');
    
    if (fs.existsSync(configPath)) {
        transmitByKey(req, res);
    }
    else {
        res.send(printerr());
    }
};

/**
 * route ajax转发的入口
 * 
 * @param  {Object} req 请求对象
 * @param  {Object} res 返回对象
 */
exports.ajaxs = function (req, res) {
    var reqUrl = req.url;
    var config = getConf(ZDP_SERVER_CONFIG); 

    if (config.vsp) {
        config.vsp.forEach(function (item) {
            if (item.ajaxs && item.tpl) {
                item.ajaxs.forEach(function (obj) {
                    if (reqUrl.indexOf(obj.url) > -1) {
                        var filePath = path.resolve(
                            process.cwd(), 
                            'page/' + item.tpl + '/ajax/' + obj.data
                        );
                        if (fs.existsSync(filePath)) {
                            res.send(fs.readFileSync(filePath));
                        }
                        else {
                            res.send({
                                status: 404, 
                                statusInfo: 'no such file `' + filePath + '`'
                            });
                        }
                        return;
                    }
                });
            }
        });
    }
    else {
        res.send(' ----WARM! `zdp-config.js` file has Error!');
    }
};

/**
 * route ajax转发的入口
 * 
 * @param  {Object} req 请求对象
 * @param  {Object} res 返回对象
 */
exports.statics = function (req, res) {
    var reqUrl = req.url;
    var config = getConf(ZDP_SERVER_CONFIG); 
    if (config.vsp) {
        config.vsp.forEach(function (item) {
            if (item.statics && item.tpl) {
                item.statics.forEach(function (obj) {
                    if (reqUrl.indexOf(obj.url) > -1) {
                        var filePath = path.resolve(
                            process.cwd(), 
                            'page/' + item.tpl + '/static/' + obj.file
                        );
                        if (fs.existsSync(filePath)) {
                            res.send(fs.readFileSync(filePath));
                        }
                        else {
                            res.send('');
                        }
                    }
                    return;
                });
            }
        });
    }
    else {
        res.send('');
    }
};

