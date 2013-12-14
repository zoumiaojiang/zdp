zdp webserver(ws)
----------------------

### Usage

    zdp webserver(ws) [--port=xxxx] [--root=xxxx]


### Description

    webserver是用于知心卡片卡发的调试服务器，也是一个代理服务器，只要的工作是进行请求转发。将请求转发到所配置的目的服务器上（如：www.baidu.com），可以借助目的服务器返回的结果进行调试和预览。

    可以指定绑定的端口号--port和绑定的根目录--root

    zdp webserver支持首屏的调试和预览，同时也会支持ajax和静态文件的调试和预览。ajax可以通过配置文件的ajaxs字段进行配置，支持多个ajax的调试，而静态文件的调试支持amd的控件开发以及所有的静态资源的转发。

    ajax的调试主要依靠vsp下的ajaxs字段，对url进行转发到webserver服务器上，webserver服务器会更具ajaxs字段下的data字段对应的json文件名上项目目录page文件夹下的模板对应文件夹下找到ajax文件夹下的json文件。从而实现ajax预览的功能。

    静态文件的原理和ajax的类似，配置在statics的字段下。

    详细情况看配置文件的说明：


### 配置文件模板(zdp-config.js)：

    
    var config = {
        vsp: [
            {
                querys: ['保险', '旅游险'],
                tpl: 'ecl_common_insurance',
                lor: 'left',
                ajaxs: [
                    {
                        url: '/ecomui/finance?controller=Insurance&action=aList',
                        data: 'insurance.json'
                    }
                ]
            },
            {
                querys: ['小贷', '贷款'],
                tpl: 'ecl_loan_list',
                lor: 'left',
                ajaxs: [
                    {
                        url: '/ecomui/finance?controller=Loan&action=aList',
                        data: 'loan.json'
                    }
                ],

                statics: [
                    {
                        url: '/ecomui/City.js',
                        file: 'City.js'
                    }
                ]
            }
        ],

        proxy: {
            hostname: 'www.baidu.com',
            port: 80,
            method: 'GET',
            path: '/s'
        }
    };

    exports.getConfig = function () {
        return config;
    };


### 配置文件注意事项及说明。
    
    vsp下的对象都为卡片对象。分别由querys， tpl， lor， ajaxs， statics等字段
    querys： 预览时触发的query。
    tpl： 模板的名称（与page文件夹下对应）。
    lor： 卡片是左边还是在右边显示
    ajaxs：ajax的调试配置，ajaxs下的一个对象表示一个ajax请求，url是真实的ajax请求地址。data是./page/some_tpl_name/ajax/xxx.json
    statics: 静态文件的调试配置，在新开发的amd控件时，如果没有线上地址，或者文件没有线上地址都可以使用这种方法配置进行转发，用法同ajaxs
    
    proxy: 目的服务器的配置信息

    

    注意：

    1. query尽量不要配成线上已经圈过的query，如果用www.baidu.com做为目的环境的话可能会出现两个卡片。。
    2. 使用zdp init之后，不要忘记修改zdp-config.js文件

