ZDP(Zhixin Development Platform)
------------

ZDP是baidu zhixin开发平台

### 安装方法
 ```
 [sudo] npm install zdp -g
 ```
### 提供命令

* zdp webserver[ws] start 
* zdp init
* zdp release
* zdp build
* zdp watch[wa] 
* zdp jshint
* zdp help

### 使用指南

#### 你想开发一个知心卡片吗？

#### 好吧，依照下面的步骤，就能成功

* 首先你应该找到一个干净并且好维护的文件夹，在该文件夹下创建page和static文件夹 
* 将github的zdp项目中的zdp-config.js和zdp-watch-config.js拷到该目录下，生成的目录结构应该如下：
```
zhixin－project/
    |- page/
    |- static/
    |- zdp-config.js
    |- zdp-watch-config.js
```
* 我们可以建一个hello world形式的卡片玩一玩，cd到该项目目录下(zhixin-project),执行`zdp init ecl_hello_world --data`, 会发现目录结构变成如下
```
 zhixin-project/
    |- page/
    |   |- ecl_hello_world/
    |        |- ajax/
    |        |- js/
    |        |- less/
    |        |- static/
    |        |- _page.tpl
    |        |- data.json
    |        |- page.html
    |        |- page.less
    |- static/
    |- zdp-config.js
    |- zdp-watch-config.js
```
* 所有文件在`zdp init`命令中如果加了--data或者-d的话都会注入初始代码
* 然后执行`zdp build ecl_hello_world` 或者 `zdp release ecl_hello_world`
* 然后需要修改zdp-config.js文件，在文件中的`congfig.vsp`中加入如下对象:
```
{
    tpl: 'ecl_hello_world',
    querys: ['helloworld'],
    lor: 'left'
},
```
* 最后可以启动服务器看看效果啦～ `zdp webserver start` 或者 `zdp ws start`。 (ps: 如果这块出现异常，那么你的8000端口肯定已经被占用了， 可以使用`zdp ws start --port=8099`替换你的端口～)
* 一切搞定, 在浏览器输入`http://localhost:8000` -> 回车， 在百度框中输入`helloworld`， 就能看到惊喜了～


#### 当然，这个demo只是一个最最最简单的例子，zdp还有很多惊喜，具体的命令如果有疑惑，可以使用`zdp help`为你解答～

### 工具适用项目
* 知心卡片(pc, pad)
* 阿拉丁卡片(pc, pad)

