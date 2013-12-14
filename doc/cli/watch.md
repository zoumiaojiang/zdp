zdp watch(wa)
-----------

### Usage

    zdp watch(wa) [taskName]


### Description

    在开发环境下watch功能非常实用，大大的提升了开发效率，不用在修改项目文件后，还要去build或者release一下，才能被预览到。

    只要在zdp-watch-config.js文件中按照格式进行配置。能够实现文件的监视功能，当文件发生变化的时候会自动的执行配置的任务指令。

    watch是通过taskName识别，taskName配置在zdp-watch-config.js中。


### 配置文件模板(zdp-watch-config.js)：

    
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


### 配置文件注意事项及说明。
    
    task下的字段都为taskName， 为了执行zdp watch taskName命令。
    default：字段是当执行zdp watch命令的时候默认的task。
    tpl： 模板的名称（与page文件夹下对应）。
    filters： 指定文件监听的规则
    commands：如果监听到变化后，继续执行的命令，如release， 目前不支持参数

    注意：

    filters中不要设置*.tpl，因为如果task的command配置成release命令的话，任何文件发生变化，release后的结果page.tpl都会发生变化，所以尽量的设置_page.tpl就行了。*.css也是类似情况。