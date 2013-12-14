/**
 * @file 开发时web调试服务器启动入口
 * @author johnson[zoumiaojiang@gmail.com]
 */

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'start';

/**
 * 命令描述信息
 * * @type {string}
 */
cli.description = '启动ZDP WebServer';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'port:',
    'root:'
];

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var route = require('./route');

var ZDP_SERVER_CONFIG = 'zdp-config';

/**
 * [getConf description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
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
 * 模块命令行运行入口
 */
cli.main = function (args, opts) {

    var server = express();
    var port = opts.port || 8000;
    var rootPath = opts.root || process.cwd();
    var config = getConf(ZDP_SERVER_CONFIG);

    server.use(express.favicon());
    server.use(express.logger('dev'));
    server.use(express.bodyParser());
    server.use(express.methodOverride());
    server.use(server.router);
    server.use(express.static(path.join(__dirname, 'public')));
    server.use(express.errorHandler());

    //对首屏请求的转发
    server.get('/', route.index);
    server.get('/s', route.index);

    if (config.vsp) {
        config.vsp.forEach(function (item) {

            //在这个地方进行ajax的集中转发
            if (item.ajaxs) {
                item.ajaxs.forEach(function (obj) {
                    if (obj.url.indexOf('?') > -1) {
                        server.get(obj.url.split('?')[0], route.ajaxs);
                    }
                    else {
                        server.get(obj.url, route.ajaxs);
                    }
                });
            }
            
            //在这个地方进行amd静态文件的集中转发
            if (item.statics) {
                item.statics.forEach(function (obj) {
                    server.get(obj.url, route.statics);
                });
            }
        });
    }
    else {
        console.log(' ----WARM! `zdp-config.js` file has Error!');
    }

    server.listen(port);

    console.log(' ----zdp webServer already started! Enjoy your develop...');
    console.log(' ----listen port=[' + port + '], root=[' + rootPath + ']');
    
};