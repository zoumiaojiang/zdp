zdp init
-----------

### Usage

    zdp init tplName [--data]

### Options

    tplName    需要创建的卡片名称(tpl)
    --data/-d  需要注入初始代码

### Description
    zdp init 命令是新建一个卡片，初始化zdp所需的代码结构，可以通过命令行参数进行初始化简单的代码模型。


### init过程

    1.在当前目录下的page文件夹中创建一个以卡片名称命名的文件夹--tplName
    1.在tplName文件夹下创建文件夹js, less, static, ajax
    2.在tplName文件夹下创建文件 `page.less, page.json, _page.tpl, page.html`
    4.如果有--data参数的话，则分别加入初始代码

### init结果

    生成了一个可开发的卡片代码目录
