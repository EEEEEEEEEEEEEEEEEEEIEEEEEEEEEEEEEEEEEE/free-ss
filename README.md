# free-ss

> 获取[https://www.mianvpn.com/](https://www.mianvpn.com/)上的免费SS节点信息，并生成config.json配置文件，搭配ssfornode和crontab任务，可到期自动更新配置

## 如何使用

`git clone https://github.com/eeve/free-ss`

`cd free-ss`

`npm install`

`cat config.json`


## Crontab

`* */5 * * * /bin/bash /xxx/free-ss/update.sh >> /xxx/free-ss/logs/update.log`

 > 将上面代码中的xxx更改为实际的路径

## License

MIT
