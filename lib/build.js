/**
 * @file 打包卡片代码
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
cli.command = 'build';

/**
 * 命令行参数
 * 
 * @type {Array}
 */
cli.options = [
    'root:'
];

/**
 * 命令用法信息
 * 
 * @type {string}
 */
cli.usage = 'zdp build [<some_tpl_name>] [--root=rootPath]';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '对知心卡片代码进行build打包合并--debug模式';



var fs = require('fs');
var path = require('path');
var utils = require('./utils');


// 全局根目录
var rootPath = '';


/**
 * 处理文件的path
 * @inner
 * @param  {string} tplname  卡片名
 * @param  {string} filename 文件名
 * @return {string}          文件的绝对路径
 */
function dealPath(tplname, filename) {

    filename = filename || '';
    tplname = tplname || '';
    return path.resolve(rootPath, './page/' + tplname + '/' + filename);
}

/**
 * build的处理逻辑
 *
 * @inner
 * @param  {string} tplname 需要build的卡片名
 */
function build(tplname) {

    utils.lessCompiler(
        dealPath(tplname, 'page.less'), 
        dealPath(tplname, 'page.css'), 
        function () {
            parse(tplname);
            console.log(' ----`%s`  build success!', tplname);
        }
    );
}

/**
 * 预编译_page.tpl文件
 *
 * @inner
 * @param  {string} tplname 将要被预编译的卡片
 */
function parse(tplname) {

    if (!fs.existsSync(dealPath(tplname, '_page.tpl'))) {
        console.log(
            ' ----' 
            + dealPath(tplname, '_page.tpl') 
            + '` is not exist!'
        );
        process.exit(1);
    }

    var _page = fs.readFileSync(dealPath(tplname, '_page.tpl'), 'utf8');
    var pagePath = dealPath(tplname, 'page.tpl');
    var regexp = /(\s*\{%\*\s*)include\s+file=\s*[\"\']((.*?\/)*?.+?(\..+?)+?)[\"\']\s*(\*%\}\s*)/igm;
    
    if (regexp.test(_page)) {

        var filenames = _page.match(regexp);
        var fileslen = filenames.length;

        for (var i = 0; i < fileslen; i ++) {
            filenames[i] = filenames[i]
                .toString()
                .replace(regexp, '$2');
        }

        filenames.forEach(function (item) {

            var fullname = dealPath(tplname, item);
            if (path.extname(fullname) === '.js') {
                utils.jsUglify(fullname, fs.readFileSync(fullname, 'utf8'));
            }
            _page = _page.replace(
                eval(''
                    + '/(\\s*\\{%\\*\\s*)include\\s+file=\\s*[\\"\\\']' 
                    + item.replace(/\//g, '\\\/') 
                    + '[\\"\\\'](\\s*\\*%\\}\\s*)/igm'
                ), 
                fs.readFileSync(fullname, 'utf8')
            );
        });
    }
    fs.writeFileSync(pagePath, _page);
}

/**
 * build命令入口
 * 
 * @param  {[type]} args    [description]
 * @param  {[type]} options [description]
 */
cli.main = function (args, options) {

    rootPath = options.root || process.cwd();

    if (!fs.existsSync(dealPath())) {
        console.log(' ----Can not found `page` folder in ' + rootPath);
        process.exit(1);
    }
    if (args.length === 0) {

        // 当命令行为 zdp build的时候
        var dirArr = fs.readdirSync(dealPath());
        
        // build page文件夹下的所有卡片
        dirArr.forEach(function (tplname) {

            if (!/^[\.\~].*/ig.test(tplname) 
                && fs.statSync(dealPath(tplname)).isDirectory()
            ) {
                build(tplname);
            }
        });
    }
    else {

        var tplname = args[0];

        if(fs.existsSync(dealPath(tplname))) {
            build(tplname);
        }
        else {
            console.log(' ----' + tplname + ' card project is not exist!');
        }
    }
};


/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;