
var config = {
    vsp: [
        {
            querys: ['保险'],
            tpl: 'ecl_common_insurance',
            lor: 'left',
            ajaxs: [
                {
                    url: '/ecomui/finance?controller=Insurance&action=aList',
                    data: 'insurance.json'
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