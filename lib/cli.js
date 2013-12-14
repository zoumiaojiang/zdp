/**
 * @file 命令行模块
 * @author johnson[zoumiaojiang@gmail.com]
 */

var utils = require('./utils');

/**
 * 获取命令行模块
 * 
 * @return {Array} 命令行的模块集合
 */
exports.getCliModules = function () {
    return utils.getModules(__dirname, 'cli');
};

/**
 * 使打印的内容制表格式输出
 *
 * @inner
 * @param  {string} str    打印的内容
 * @param  {number} length 制表符的字符长度
 */
function alignLeft(str, length) {
    length = length || 16;
    return str.length < length 
        ? str + new Array(length - str.length).join(' ') : str;
}

/**
 * 打印zdp命令行的log信息
 * 
 * @inner
 */
function printCliMsg() {
    console.log(
        '\n ----Usage: zdp <command> [<args>] [<options>]\n' +
        '\n ----Default Commands:'
    );
    exports.getCliModules().forEach(function (mod) {

        var cli = mod.cli;
        var alias = cli.alias;
        var command = cli.command;

        console.log( '%s %s',
            alignLeft('        ' + command 
                + (alias ? ' [' + alias + ']' : '' ), 30
            ),
            ('---' + cli.description || '').replace(/(。|\.)$/, '')
        );
    });
    console.log('\n ----See "zdp help <command>" for more information.');
}


/**
 * 命令行链表类
 *
 * @inner
 * @constructor
 * @param {Object} mod 模块对象
 */
function CommandLine(mod) {
    this.child = {};
    this.module = mod || {};
}

/**
 * 获取子命令行节点
 *
 * @inner
 * @param {string} name 子节点名称
 * @return {CommandLine}
 */
CommandLine.prototype.getChild = function (name) {
    return this.child[name] || null;
};

/**
 * 添加子命令行节点
 *
 * @inner
 * @param {Object} child 子节点模块
 */
CommandLine.prototype.addChild = function (child) {
    
    var mod = child.module;
    var cli = mod.cli;

    if (cli) {
        this.child[cli.command] = child;
        
        if (cli.alias) {
            this.child[cli.alias] = child;
        }
    }
};

/**
 * 获取子命令行节点的模块
 *
 * @inner
 * @param {string} name 子节点名称
 * @return {Object}
 */
CommandLine.prototype.getChildModule = function (name) {
    var node = this.getChild(name);
    return node ? node.module : null;
};

/**
 * 命令模块索引
 *
 * @inner
 * @type {Object}
 */
var rootCli = new CommandLine();

/**
 * 扫瞄目录，用于建立命令模块索引
 *
 * @param {string} dir 目录路径名
 * @param {string=} commandPath 命令路径
 */
function scanDir(dir, parentNode) {

    parentNode = parentNode || rootCli;
    
    var fs = require('fs');
    var path = require('path');

    fs.readdirSync(dir).sort(function (file) {
        
        var fullPath = path.resolve(dir, file);
        return fs.statSync( fullPath ).isDirectory() ? 1 : -1;
    }).forEach(function (file) {
        
        var fullPath = path.resolve(dir, file);
        var stat = fs.statSync(fullPath);
        var extName = path.extname(file);
        var name = path.basename(file, extName);

        if (stat.isFile() && /^\.js$/i.test(extName)) {
            try {
                var module = require(fullPath);
                var cli = module.cli;
                if (cli) {
                    var tmpNode = new CommandLine(module);
                    parentNode.addChild(tmpNode);
                }
            }
            catch (ex) {
                // do nothing
            }
        }
        else if (stat.isDirectory() && name != 'node_modules') {
            scanDir(fullPath, parentNode.getChild(name));
        }
    });
}

// create module index
scanDir(__dirname);

/**
 * 解析选项信息。选项信息格式示例：
 *
 * + `h`: -h
 * + `help`: -h 或 --help
 * + `output:`: -o xxx 或 --output xxx 或 --output=xxx
 *
 * @inner
 * @param {string|Object} option 选项信息
 * @return {Object}
 */
function parseOption(option) {
    
    if (typeof option === 'string') {
        if (/^([-_a-zA-Z0-9]+)(:)?$/i.test(option)) {
            
            var name = RegExp.$1;
            
            option = {};
            option.requireValue = !!RegExp.$2;
            
            if (name.length > 1) {
                option.name = name.charAt(0);
                option.fullname = name;
            }
            else {
                option.name = name;
            }
        }
        else {
            throw new Error('Option string is invalid: ' + option);
        }
    }

    return option;
}

/**
 * 获取命令对应模块
 *
 * @param {string} command 命令名称
 * @return {Object}
 */
exports.getModule = function (command) {
    return rootCli.getChildModule(command);
};

/**
 * 获取命令对应子模块列表
 *
 * @param {string} command 命令名称
 * @return {Array}
 */
exports.getSubModules = function (command) {
    
    var node = rootCli.getChildModule(command);
    var modules = [];

    Object.keys(node.child || {}).forEach(function (key) {
        modules.push(node.getChildModule(key));
    });

    return modules;
};

/**
 * 解析命令行参数。作为命令行执行的入口
 *
 * @param {Array} args 参数列表
 */
exports.parse = function (args) {
    
     // 查找命令模块
    var commandNode = rootCli;
    var commandName = '';

    args = args.slice(2);

    // 无参数时显示默认信息
    if ( args.length === 0 ) {
        printCliMsg();
        return;
    }

    // 显示版本信息
    if ( args[0] === '--version' 
        || args[0] === '-v' 
        || args[0] === '-version' 
        || args[0] === '--v'
    ) {
        console.log(' ----zdp version ' + require('./zdp').version);
        return;
    }

    while (args.length) {
        commandName = args[0];
        if (commandNode.getChild(commandName)) {
            commandNode = commandNode.getChild(commandName);
            args.shift();
        }
        else {
            break;
        }
    }

    // 无命令模块时直接错误提示并退出
    var commandModule = commandNode.module;
    
    if (!commandModule) {
        console.log(' ----Error Command.');
        return;
    }

    // 解析参数
    var commandArgs = [];
    var commandOptions = {};
    
    while (args.length) {
        var seg = args.shift();

        if (/^-(-)?([-_a-zA-Z0-9]+)(=([^=]+))?$/i.test(seg)) {
            
            var optionInfo = {};
            
            optionInfo[ RegExp.$1 ? 'fullname' : 'name' ] = RegExp.$2;
            optionInfo.value = RegExp.$4;

            if (commandModule.cli) {
                
                var moduleOptions = commandModule.cli.options || [];
                
                for (var i = 0; i < moduleOptions.length; i ++) {
                    var opt = parseOption(moduleOptions[i]);
                    if ( opt.fullname === optionInfo.fullname
                         || opt.name === optionInfo.name
                    ) {
                        var value = true;
                        if (opt.requireValue) {
                            value = optionInfo.value || args.shift();
                        }

                        commandOptions[opt.name] = value;
                        opt.fullname && (commandOptions[opt.fullname] = value);
                        break;
                    }
                }
            }
        }
        else {
            commandArgs.push(seg);
        }
    }

    //console.log(commandArgs);
    //console.log(commandOptions);
    if (!commandModule.cli) {
        console.log(' ----Error Command');
        return;
    }
    // 运行命令
    commandModule.cli.main(commandArgs, commandOptions);
};
