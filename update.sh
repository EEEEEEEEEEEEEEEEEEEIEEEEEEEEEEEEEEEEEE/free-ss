#!/bin/bash
# 定时任务，更新SS配置
#
#

# 载入系统环境变量
. /etc/profile

echo "==================================="

# 设置当前脚本目录为基础目录
BASE=`dirname $0`

## 进入基础目录
cd $BASE

echo "基础目录： `pwd`"
echo "开始更新配置..."
## 更新SS配置
/usr/local/bin/node ./index.js

## 重启SS服务

PID=`lsof -i:1080 | grep LISTEN | awk '{ print $2; }'`

if [ "$PID" !=  "" ]; then
	kill $PID
	echo "杀掉已有SS进程：${PID}"
fi

./node_modules/.bin/sslocal -c ./config.json >> ./logs/shadowsocks.log &
echo "启动完毕..."

echo "==================================="
echo ""
echo ""

