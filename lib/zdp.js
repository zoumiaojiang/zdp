/**
 * @file zdp控制中心
 * @author johnson[zoumiaojiang@gmail.com]
 */

/**
 * zdp版本信息
 *
 * @type {string}
 */
exports.version = JSON.parse(
    require('fs').readFileSync( 
        require('path').resolve(__dirname, '../package.json'), 'UTF-8'
    )
).version;
