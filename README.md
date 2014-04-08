ZDP(Zhixin Development Platform)
------------

ZDP是baidu zhixin开发平台


### 注意事项：

    请下载最新版本node

    windows下直接 npm install -g zdp 安装

    Linux/UNIX下 npm install -g zdp安装后，如果出现'No such file or directory'警告,

    解决1: 需要在.bash_profile中添加 alias zdp="node zdp的全局安装路径/bin/zdp-cli"
    解决2: 找到 zdp的全局安装路径/bin/zdp-cli ， 使用vim打开文件，在命令行模式下输入 :set fileformats=unix   :wq
