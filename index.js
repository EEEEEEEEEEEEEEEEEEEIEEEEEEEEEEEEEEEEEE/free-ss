var fetch = require('node-fetch');
var fs = require('fs');

var CONFIG_FILE = __dirname + "/config.json";

function parseJSON(response) {
  return response.json()
}


function GetAccount1(){
	console.log('正在尝试拉取mianvpn免费账户信息');
	return new Promise(function(resolve, reject){
		fetch("https://api.mianvpn.com/ajax.php?verify=true&mod=getfreess&t=" + new Date().getTime())
			.then(parseJSON)
			.then(function(data){
				var node = null;
				var speedRegExp = /\"netspeed\":\"(\d+\.\d+)_([A-Z]{1,2})\/s\"/;

				for (var i = 0; i < data.length; i++) {
					var temp = data[i];
					if(temp.st != true){
						continue;
					}
					if(node == null) {
						node = temp;
					} else {
						// 正则获取速度与单位
						var _nodeResult = node.l.match(speedRegExp);
						var _tempResult = temp.l.match(speedRegExp);
						var speed = parseFloat(_nodeResult[1]);
						var unit = _nodeResult[2];
						var _speed = parseFloat(_tempResult[1]);
						var _unit = _tempResult[2];
						// 统一单位
						if(unit != _unit){
							speed = UnitFormat2MB(speed, unit);
							_speed = UnitFormat2MB(speed, _unit);
						}

						if(_speed > speed){
							node = temp;
						}
					}
				}
				resolve(node);
			})
			.catch(function(err){
				console.log('请求失败：', err);
				resolve(null);
			});
	});
}

function GetAccount2(){
	console.log('正在尝试拉取ishadowsocks免费账户信息');
	var regx = /服务器地址:([\w.]+)<\/h4>\s+<h4>端口:(\d+)<\/h4>\s+<h4>\w+密码:(\d+)<\/h4>\s+<h4>加密方式:([\w-]+)<\/h4>\s+<h4>状态:<font color="green">正常<\/font><\/h4>/;
	return new Promise(function(resolve, reject){
		fetch("https://www.ishadowsocks.biz/")
			.then(function(res) {
				return res.text();
			})
			.then(function(text) {
				var arr = text.match(regx);
				var node = {
					i: arr[1], // ip
					p: arr[2], // port
					pw: arr[3], // password
					m: arr[4] // method
				};
				resolve(node);
			})
			.catch(function(err){
				console.log('请求失败2：', err);
				resolve(null);
			});
	});
}

function GetAccount(){
	return GetAccount1().then(function(node) {
		if(node == null) {
			return GetAccount2();
		} else {
			return node;
		}
	}).then(function(node) {
		if(node == null){
			Promise.reject(new Error("无可用节点"));
		} else {
			return node;
		}
	});
}

function WriteConfigToLocal(config){
	return new Promise(function(resolve, reject){
		var cfg = JSON.stringify({
			server: config.i,
			server_port: config.p,
			local_address: "127.0.0.1",
			local_port: 1080,
			password: config.pw,
			timeout: 600,
			method: config.m
		}, null, "\t");
		fs.writeFile(CONFIG_FILE, cfg, {
			encoding: "utf-8"
		}, function(err){
			if(err){ reject(err); return;}
			resolve(cfg);
		});
	});
}

function UnitFormat2MB(size, unit){
	switch(unit.toUpperCase()){
		case "KB":
			size = size / 1024;
			break;
		case "B":
			size = size / (1024*2);
			break;
	}
	return size;
}

GetAccount().then(function(dto){
	return WriteConfigToLocal(dto);
}).then(function(cfg){
	console.log("获取到最新配置为：", cfg);
	console.log("配置更新成功～");
}).catch(function(err){
	console.log("配置更新失败～", err);
});

