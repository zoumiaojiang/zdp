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
cli.command = 'release';

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
cli.usage = 'zdp release [<some_tpl_name>] [--root=rootPath]';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '对知心卡片代码进行打包合并以及压缩--发布模式';


var fs = require('fs');
var path = require('path');
var utils = require('./utils');


// 全局根目录
var rootPath = '';

/**
 * 处理文件的path
 * 
 * @inner
 * @param  {string} filename 文件名
 * @return {string}          文件的绝对路径
 */
function dealPath(tplname, filename) {

    filename = filename || '';
    tplname = tplname || '';
    return path.resolve(rootPath, './page/' + tplname + '/' + filename);
}

/**
 * jsUglify
 *
 * @inner
 */
function jsUglify(root, fileList) {

    fileList.forEach( function (item) {
        var fullPath = path.resolve(root, item);
        if (fs.statSync(fullPath).isFile() 
            && path.extname(fullPath).toLowerCase() === '.js'
        ) {
            var minCode = utils.jsUglify(fs.readFileSync(fullPath, 'utf8'));
            var itemTmp = item.split('/');
            if (itemTmp.length > 1) {
                item = itemTmp[itemTmp.length - 1];
            }
            fs.writeFileSync(
                path.resolve(__dirname, '../tmp/' + item + 'tmp'),
                minCode
            );
        }
    });
}

/**
 * 压缩css代码
 *
 * @inner
 * @param  {string} tplname 需要release的卡片名
 */
function mincss(tplname) {

    var code = fs.readFileSync(dealPath(tplname, 'page.css'), 'utf8');
    var minCode = utils.mincss(code);

    fs.writeFileSync(dealPath(tplname, 'page.css'), minCode);
}

/**
 * release的处理逻辑
 *
 * @inner
 * @param  {string} tplname 需要release的卡片名
 */
function release(tplname) {

    //因为less木有提供同步的方法。。。所以只能这么SB的做一个回调
    utils.lessCompiler(
        dealPath(tplname, 'page.less'), 
        dealPath(tplname, 'page.css'), 
        function () {
            mincss(tplname);
            parse(tplname);
            console.log(' ----`%s`  release success!', tplname);
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
        console.log('--' + dealPath(tplname, '_page.tpl') + '` is not exist!');
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

        jsUglify(dealPath(tplname), filenames);

        filenames.forEach(function (item) {

            var tmpArr = item.split('/');
            var tmpItem = tmpArr[tmpArr.length - 1];
            var extname 
                = path.extname(dealPath(tplname, item)).toLowerCase();
            var confile = extname === '.js' 
                    ? path.resolve(__dirname, '../tmp/' + tmpItem + 'tmp')
                    : dealPath(tplname, item);
            _page = _page.replace(
                eval(''
                    + '/(\\s*\\{%\\*\\s*)include\\s+file=\\s*[\\"\\\']' 
                    + item.replace(/\//g, '\\\/') 
                    + '[\\"\\\'](\\s*\\*%\\}\\s*)/igm'
                ),
                fs.readFileSync(confile, 'utf8')
            );
        });
    }
    fs.writeFileSync(pagePath, _page);
    rmFile(path.resolve(__dirname, '../tmp'), '.jstmp');
}

/**
 * 通过文件后缀名删除某文件夹下的所有文件
 *
 * @inner
 * @param  {string} root    根目录
 * @param  {string} extname 文件后缀名
 */
function rmFile(root, extname) {
    if (fs.existsSync(root) && fs.statSync(root).isDirectory()) {
        fs.readdirSync(root).forEach(function (file) {
            if (!(/^\./ig.test(file))) {
                var dirPath = path.resolve(root, file);
                if (fs.statSync(dirPath).isDirectory()) {
                    rmFile(dirPath, extname);
                }
                else {
                    if (path.extname(file) === extname) {
                        fs.unlinkSync(dirPath);
                    }
                }
            }
        });
    }
}

/**
 * release命令入口
 *
 * @param  {Array} args    属性列表
 * @param  {Array} options 参数列表
 */
cli.main = function (args, options) {

    rootPath = options.root || process.cwd();

    if (!fs.existsSync(dealPath())) {
        console.log(' ----Can not found `page` folder in ' + rootPath);
        process.exit(1);
    }
        
    if (args.length === 0) {

        // 当命令行为 zdp release的时候
        var dirArr = fs.readdirSync(dealPath());

        dirArr.forEach( function (tplname) {
            if (!/^[\.\~].*/ig.test(tplname) 
                && fs.statSync(dealPath(tplname)).isDirectory()
            ) {
                release(tplname);
            }
        });
    }
    else {

        var tplname = args[0];

        if(fs.existsSync(dealPath(tplname))) {
            release(tplname);
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