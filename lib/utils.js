/**
 * @file zdp工具包
 * @author johnson[zoumiaojiang@gmail.com]  
 */

var fs = require('fs');
var path = require('path');
var os = require('os');
var tmpdir = os.tmpdir();

/**
 * 得到临时存放文件夹
 * 
 * @return {string} 临时文件夹路径
 */
exports.getTmpDir = function () {
    return os.platform() === 'win32'
            ? path.resolve(__dirname, '../tmp')
            : tmpdir;
};

/**
 * 获取指定模块
 *
 * @inner
 * @param  {string} root 指定根目录
 * @return {Array}       命令行模块集合
 */
exports.getModules = function (root, prop) {

    var modules = [];

    fs.readdirSync(root).forEach(function (file) {
        file = path.resolve(root, file);
        if (fs.statSync(file).isFile() 
            && path.extname(file).toLowerCase() === '.js'
        ) {
            var module = require(file);
            if (module[prop]) {
                modules.push(module);
            }
        }
    });

    return modules;
};

/**
 * 合并对象
 *
 * @param  {Object} target 源对象
 * @return {Object}        目标对象
 */
exports.extend = function(target) {
    
    for ( var i = 1; i < arguments.length; i++ ) {
        
        var obj = arguments[i];
        if (obj == null) {
            break;
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                target[key] = obj[key];
            }
        }
    }
    return target;
};


/**
 * 使用Uglify-js编译压缩JS代码
 * 
 * @param  {string} code 原始的js代码
 * @return {string}      压缩后的js代码
 */
exports.jsUglify = function (filename, code) {
    
    var UglifyJS = require('uglify-js');
    var ast = null
    try {
        ast = UglifyJS.parse(code);
    } catch(ex) {
        console.log(' ----error in ' + filename + ' \n ----' 
            + ex.message 
            + " (line: " + ex.line 
            + ", col: " + ex.col 
            + ", pos: " + ex.pos + ")"
        )
        process.exit(0);
    }
    ast.figure_out_scope();

    //ast = ast.transform(UglifyJS.Compressor());

    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names({ 
        except: [ '$', 'require', 'exports', 'module' ] 
    });

    return ast.print_to_string();
};

/**
 * 压缩css代码
 * 
 * @param  {string} code 压缩前的css代码
 * @return {string}      压缩后的css代码
 */
exports.mincss = function (code) {
    var processor = require('uglifycss').processString;
    var extraParam = {
        maxLineLen: 0,
        expandVars: false,
        cuteComments: true
    };
    return processor(code, extraParam);
};

/**
 * 编译less代码（异步）
 * 
 * @inner
 * @param {string} code less源代码
 * @param {Object} parserOptions 解析器参数
 * @param {function(string)} callback 编译完成回调函数
 */
function compileLessAsync(code, parserOptions, callback) {
    
    // less没有提供sync api
    var less = require('less');
    var parser = new(less.Parser)(parserOptions);

    parser.parse(code, function (error, tree) {
        if (error) {
            callback(error);
        }
        else {
            try {
                callback(
                    null, 
                    tree.toCSS({
                        compress: !!parserOptions.compress || false
                    })
                );
            }
            catch (ex) {
                console.log(ex)
                callback({ message: 'less complile fail' });
            }
        }
    });
}

/**
 * 编译less为css代码
 * 
 * @param  {string}   lesspath less文件的路径
 * @param  {string}   csspath  将要存放css的路径
 * @param  {Function} callback 回调
 */
exports.lessCompiler = function(lesspath, csspath, callback) {

    var parserOptions = exports.extend({},
        {
            paths: [require('path').dirname(lesspath)],
            relativeUrls: true,
            compress: false
        }, 
        this.compileOptions || {}
    );

    try {
        compileLessAsync( 
            fs.readFileSync(lesspath, 'utf8'), 
            parserOptions, 
            function (err, compiledCode) {
                if (err) {
                    console.log(' ----less complile error!');
                    console.log(err);
                    process.exit(0);
                }
                else {
                    fs.writeFileSync(csspath, compiledCode);
                }
                callback();
            }
        );
    }
    catch (ex) {
        callback();
    }
};

/**
 * 删除目录
 * 
 * @param {string} path 目录路径
 */
exports.rmdir = function (path) {

    if ( fs.existsSync(path) && fs.statSync(path).isDirectory()) {
        fs.readdirSync(path).forEach(
            function (file) {
                var fullPath = path.join(path, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    exports.rmdir(fullPath);
                }
                else {
                    fs.unlinkSync(fullPath);
                }
            }
        );

        fs.rmdirSync(path);
    }
};
