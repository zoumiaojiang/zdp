/**
 * @file 初始化知心卡片模块
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
cli.command = 'init';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'root:',
    'data:'
];

/**
 * 命令用法信息
 * 
 * @type {string}
 */
cli.usage = 'zdp init some_tpl_name [--root=rootPath] [--data/-d]';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '初始化一个新的卡片';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

var rootPath = '';

/**
 * init命令入口
 * 
 * @param  {Array} args    属性列表
 * @param  {Array} options 参数列表
 */
cli.main = function (args, options) {

    var fs = require('fs');
    var path = require('path');

    rootPath = options.root || process.cwd();

    if (args.length === 0) {
        console.log(' ----Command like `zdp init sample_tpl_name`');
    }
    else {

        var pagePath = path.resolve(rootPath, './page');

        /**
         * 初始文件夹列表
         * 
         * @type {Array}
         */
        var dirList = [
            'js',
            'less',
            'static',
            'ajax'
        ];

        /**
         * 初始文件列表
         * 
         * @type {Array}
         */
        var fileList = [
            'data.json',
            'page.html',
            'page.less',
            '_page.tpl'
        ];
        if (!fs.existsSync(pagePath)) {
            console.log(' ----Please create ' + pagePath + ' first.');
        }
        else {

            var tplPath = path.resolve(pagePath, args[0]); 

            if (!fs.existsSync(tplPath)) {
                fs.mkdirSync(tplPath);
            }

            console.log(' ----begin init, Do not forget change'
                +' `zdp-config.js` after init.'
            );
            console.log(' ----' + tplPath + ' 目录创建成功.');

            dirList.forEach(function (dirname) {

                var dirPath = path.resolve(tplPath, dirname);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                console.log(' ----' + dirPath + ' 目录创建成功.');
            });
            
            fileList.forEach( function (filename) {

                var filePath = path.resolve(tplPath, filename);
                if (options.hasOwnProperty('d')) {
                    fs.writeFileSync(
                        filePath, 
                        fs.readFileSync(
                            path.resolve(__dirname, '../tmp/' + filename),
                            'utf8'
                        )
                    );
                }
                else {
                    fs.writeFileSync(filePath, '');
                }
                console.log(' ----' + filePath + ' 文件创建成功.');
            });
        }
    }
};