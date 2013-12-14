/**
 * @file zdp watch 核心文件监控模块
 * @author johnson[zoumiaojiang@gmail.com]
 */


var fsmonitor = require('fsmonitor');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');



/**
 * 文件监视器
 *
 * @public
 * @constructor
 */
function Monitor() {
    EventEmitter.call(this);
}

util.inherits(Monitor, EventEmitter);

/**
 * 初始化文件监视器
 * 
 * @public
 * @param {string} path 监视的目录
 * @param {Object} conf 监视器的配置
 */
Monitor.prototype.init = function (path, conf) {
    
    var me = this;

    if (!fs.existsSync(path)) {
        console.log(' ----' + path + ' is not exist, Please check');
        process.exit(1);
    }

    conf = conf || {};
    
    fsmonitor.watch(path, null, function (change) {
        me.emit('all', change);

        [
            'addedFiles',
            'modifiedFiles',
            'removedFiles',
            'addedFolders',
            'modifiedFolders'
        ].forEach(function (type) {
            if (change[type].length > 0) {
                //console.log(' ----watch %s: %s', type, change);
                me.emit(type, change[type], change);
            }
        });
    });

    console.log(' ----Task Monitor Ready');
    me.emit('ready');
    console.log(' ----monitor -> %s', path);
};


module.exports = Monitor;