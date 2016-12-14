# free-ss

> 获取免费SS节点信息，并生成config.json配置文件，搭配[ssfornode](https://github.com/shadowsocks/shadowsocks-nodejs)和开机启动以及crontab任务，可到期自动更新配置

## 如何使用

`git clone https://github.com/eeve/free-ss`

`cd free-ss`

`npm install`

`npm start`

`cat config.json`


## Crontab

`* */5 * * * /bin/bash /xxx/free-ss/update.sh >> /xxx/free-ss/logs/update.log`

 > 将上面代码中的xxx更改为实际的路径


## 感谢以下网址提供免费账户信息
 - [https://www.mianvpn.com/](https://www.mianvpn.com/)
 - [https://www.ishadowsocks.biz/](https://www.ishadowsocks.biz/)
 - [https://freevpnss.cc/#shadowsocks](https://freevpnss.cc/#shadowsocks)

 > 免费账户不能保证你的上网隐私，请尽量购买付费服务或自行搭建SS

## License

MIT
