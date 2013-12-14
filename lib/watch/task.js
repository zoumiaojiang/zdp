/**
 * @file 处理watch的任务
 * @author Johnson[zoumiaojiang@gmail.com]
 */


var path = require('path');

/**
 * 文件相关的事件
 * 
 * @inner
 * @type {Array}
 */
var fileEvents = [
    'addedFiles',
    'modifiedFiles',
    'removedFiles'
];

/**
 * 文件夹相关的事件
 * 
 * @inner
 * @type {Array}
 */
var folderEvents = [
    'addedFolders',
    'modifiedFolders'
];

/**
 * 任务
 * 
 * @constructor
 * @param {string} name 任务Name
 * @param {Monitor} monitor 相关联的monitor
 */
function Task(name, monitor, conf) {

    this.name = name;
    this.monitor = monitor;
    this.conf = conf || {};

    this.bindEvents();
}

/**
 * 为task绑定监听事件
 *
 * @inner
 */
Task.prototype.bindEvents = function () {

    var me = this;

    if (!this.conf.events) {
        console.log(' ----No `events` in this task, Please check config file');
       process.exit(1);
    }

    if (this.conf.events.length === 0) {
        this.conf.events = fileEvents.concat(folderEvents);
    }

    // 若为字符串，则认为只监听一个事件
    if ( typeof this.conf.events === 'string' ) {
        this.conf.events = [this.conf.events];
    }

    this.conf.events.forEach(function (eventName) {
        if (~fileEvents.indexOf(eventName)) {
            
            // 文件变化事件
            me.monitor.on(eventName, me.fileChangeHandler.bind(me));
        }
        else if (~folderEvents.indexOf(eventName)) {

            // 文件夹变化事件
            me.monitor.on(eventName, me.folderChangeHandler.bind(me));
        }
        else {
            console.log(
                ' ----`%s` is not a right event, Please check `%s`', 
                eventName, 
                'config file'
            );
            process.exit(1);
        }
    });
};

/**
 * 文件变化事件处理
 * 
 * @private
 * @param {Array} files 变化的文件列表
 */
Task.prototype.fileChangeHandler = function(files) {
    
    var me = this;

    files.forEach(function (file) {
        
        if (!(/^\~/ig.test(file))) {
            var filters = me.conf.filters || [];

            filters.forEach(function (filter) {
                if (filter.indexOf('*') > -1 
                    && filter.split('*')[1] === path.extname(file)
                ) {
                    console.log(' ----change of ' + file);
                    me.doWatch();
                }
                else if (filter.indexOf('*') === -1 && file === filter) {
                    console.log(' ----change of ' + file);
                    me.doWatch();
                }
            });
        }
    });
};

/**
 * 文件夹变化事件处理
 * 
 * @private
 * @param {Array} folders 变化的文件夹列表
 */
Task.prototype.folderChangeHandler = function(folders) {
    
    var me = this;

    folders.forEach(function (folder) {
        if (!(/^\./ig.test(file))) {
            console.log(' ----change of ' + folder);
            me.doWatch();
        }
    });
};

/**
 * 处理监听的结果
 */
Task.prototype.doWatch = function () {

    var me = this;
    
    if (me.conf.commands) {
        var commands = me.conf.commands;
        commands.forEach(function (command) {
            var child_process = require('child_process');
            var execCommand = 'zdp ' + command + ' ' + me.conf.tpl;
            child_process.exec(execCommand, 
                function (err, stdout, stderr) {
                    if (err) {
                        console.log(' ----error in command ' + execCommand);
                    }
                    else {
                        console.log(stdout);
                    }
                }
            );
        });
    }
    else {
        console.log(' ----No `commands` in this task');
    }
};

module.exports = Task;

