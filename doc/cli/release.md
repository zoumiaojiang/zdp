zdp release
---------

### Usage

    zdp release [tplName]

### Options

    tplName   需要release的卡片名称

### Description
    zdp relese 命令是得到release版的卡片page.tpl,得到的结果直接可以在zdp的代理服务器（[zdp webserver start]）中查看预览结果。生成可以直接在PS上使用的`page.tpl`文件

### release过程

    1.判断release哪一个卡片，如果没有指定编译的卡片名，则编译当前目录下page文件夹下的所有的卡片。
    2.编译当前卡片下的page.less为pege.css。
    3.压缩page.css
    4.寻找卡片下_page.tpl文件。
    5.通过正则找到_page.tpl文件内容中的 ·{%*include flie="xxx.xx"*%}·。
    6.通过解析出不同的文件路径找到相应的文件，找到.js文件进行压缩成临时文件
    7.通过解析出不同的文件路径找到相应的文件（如page.css），然后用内容替换正则匹配的结果。
    8.删除临时文件
    6.把内容整合到page.tpl中。

### release结果

    得到最终可被PS接受的`page.tpl`文件 ----release版