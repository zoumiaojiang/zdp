/**
 * @file 开发zhixin卡片时web调试服务器模块
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
cli.command = 'webserver';

/**
 * 命令缩写
 *
 * @type {string}
 */
cli.alias = 'ws';

/**
 * 命令用法信息
 * 
 * @type {string}
 */
cli.usage = 'zdp webserver';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '知心卡片开发平台调试Server';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

/**
 * webserver命令入口
 * 
 * @param  {Array} args    属性列表
 * @param  {Array} options 参数列表
 */
cli.main = function (args, options) {
    console.log(' ----Please use `zdp webserver start`');
};