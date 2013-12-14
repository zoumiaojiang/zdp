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
cli.command = 'help';

/**
 * 命令缩写
 *
 * @type {string}
 */
cli.alias = 'h';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '显示帮助信息';



var fs = require('fs');
var path = require('path');
var msee = require('msee');
var cliModule = require('./cli');

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {

    var command = args[ 0 ] || 'help';
    var module = cliModule.getModule(command);

    if (module) {

        var docFile = path.resolve(
            __dirname, 
            '../doc/cli', 
            module.cli.command + '.md'
        );
        var cliInfo = module.cli;
        
        // 显示子命令帮助信息
        var subModules = cliModule.getSubModules(command);

        if (fs.existsSync(docFile) ) {
            console.log(msee.parseFile( docFile ));
            return;
        }
        
        // 显示用法帮助信息
        if (cliInfo.usage) {
            console.log('Usage: ' + cliInfo.usage + '\n');
        }

        // 显示命令描述信息
        if (cliInfo.description) {
            console.log(cliInfo.description);
        }

        if (subModules.length) {
            console.log('Sub Command:');
            var maxlength = 0;
            subModules.forEach(function (module) {
                maxlength = Math.max(maxlength, module.cli.command);
            });
            
            subModules.forEach(function (module) {
                
                var cliInfo = module.cli;
                var command = cliInfo.command;
                var gap = '    ';
                
                for (var i = command.length; i < maxlength; i++) {
                    gap += ' ';
                }

                console.log(command + gap + cliInfo.description);
            });
        }
    }
    else {
        console.log(command + ' is an error command!');
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
