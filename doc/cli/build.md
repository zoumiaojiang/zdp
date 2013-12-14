zdp build
---------

### Usage

    zdp build [tplName]

### Options

    tplName   需要build的卡片名称

### Description
    zdp build 命令是得到debug版的卡片page.tpl,得到的结果直接可以在zdp的代理服务器（[zdp webserver start]）中查看预览结果。


### build过程

    1.判断build哪一个卡片，如果没有指定编译的卡片名，则编译当前目录下page文件夹下的所有的卡片。
    2.编译当前卡片下的page.less为pege.css。
    3.寻找卡片下_page.tpl文件。
    4.通过正则找到_page.tpl文件内容中的 ·{%*include flie="xxx.xx"*%}·。
    5.通过解析出不同的文件路径找到相应的文件（如page.css），然后用内容替换正则匹配的结果。
    6.把内容整合到page.tpl中。

### build结果

    得到最终可被PS接受的`page.tpl`文件 ----debug版