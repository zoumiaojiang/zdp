/**
 * @file 监视模块
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
cli.command = 'watch';

/**
 * 命令缩写
 *
 * @type {string}
 */
cli.alias = 'wa';

/**
 * 命令用法信息
 * 
 * @type {string}
 */
cli.usage = 'zdp watch [taskName]';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'config:'
];

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = 'ZDP在开发环境下对文件改动的监听';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;



var path = require('path');
var fs = require('fs');
var monitor = new (require('./watch/monitor'));
var Task = require('./watch/task');


/**
 * 得到配置文件信息
 *
 * @inner
 * @param  {string} file 配置文件名
 * @return {Object}      配置文件信息
 */
function getConf (file) {

    var filePath = path.resolve(process.cwd(), file + '.js');

    if (!fs.existsSync(filePath)) {
        console.log(
            ' ----Can not found `%s` in `%s`', 
            file + '.js', 
            process.cwd()
        );
        process.exit(1);
    }

    return require(filePath).getTasks();
}

/**
 * 启动watch
 *
 * @inner
 * @param  {string} tplname  需要watch的tpl
 */
function initWatch(tplname) {
    
    var tplPath = path.resolve(process.cwd(), 'page/' + tplname);
    if (tplname && !/^[\.\~].*/ig.test(tplname) &&  fs.existsSync(tplPath)) {

        var rootPath = path.resolve(process.cwd(), 'page/' + tplname);
        monitor.init(rootPath);
    }
    else {
        console.log(' ----error config in `zdp-watch-config.js`');
    }
}


/**
 * watch命令入口
 * 
 * @param  {Array} args    属性列表
 * @param  {Array} options 参数列表
 */
cli.main = function (args, options) {

    var WATCH_CONFIG_FILE = 'zdp-watch-config';
    var tasks = getConf(WATCH_CONFIG_FILE);

    if (args.length === 0) {
        if (tasks['default']) {
            var tmp = tasks['default'];
            initWatch(tmp.tpl);
            new Task(tmp.tpl, monitor, tmp);
        }
        else {
            console.log(' ----You don\'t have a default task in config file');
            console.log(' ----'
                + 'You also can give a taskName which config in `%s`'
                + 'used like `zdp watch one_task_name`', 
                WATCH_CONFIG_FILE + '.js'
            );
            process.exit(1);
        }
    }
    else {
        if (tasks[args[0]]) {
            var tmp = tasks[args[0]];
            initWatch(tmp.tpl);
            new Task(tmp.tpl, monitor, tmp);
        }
        else {
            console.log(' ----No such task in your `zdp-watch-config.js`');
        }
    }
    
};