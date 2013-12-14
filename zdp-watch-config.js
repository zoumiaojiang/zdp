
/**
 * task配置
 * @type {Object}
 */


//events类型

//'addedFiles',
//'modifiedFiles',
//'removedFiles'
//'addedFolders',
//'modifiedFolders',
//'removedFolders'



var tasks = {
    'default': {
        tpl: 'ecl_loan_list',
        filters: [
            '*.js',
            '*.less',
            '*.html',
            '_page.tpl'
        ],
        events: [],
        commands: [
            'release'
        ]
    },
    'insurance': {
        tpl: 'ecl_common_insurance',
        filters: [
            '*.js',
            '*.less',
            '_page.tpl'
        ],
        events: [
            'addedFiles',
            'modifiedFiles'
        ],
        commands: [
            'jshint', 
            'build'
        ]
    }
};


exports.getTasks = function () {
    return tasks;
};
