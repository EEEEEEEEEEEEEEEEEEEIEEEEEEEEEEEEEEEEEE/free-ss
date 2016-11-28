var fetch = require('node-fetch');
var fs = require('fs');

var CONFIG_FILE = __dirname + "/config.json";

function parseJSON(response) {
  return response.json()
}

function GetAccount(){
	return new Promise(function(resolve, reject){
		fetch("https://api.mianvpn.com/ajax.php?verify=true&mod=getfreess&t=" + new Date().getTime())
			.then(parseJSON)
			.then(function(data){
				var node = null;
				var prefix = 'netspeed":"';

				for (var i = 0; i < data.length; i++) {
					var temp = data[i];
					if(temp.st != true){
						continue;
					}
					if(node == null) {
						node = temp;
					} else {
						var speed = parseFloat(node.l.substring(node.l.indexOf(prefix) + prefix.length, node.l.length - 7));
						var _speed = parseFloat(temp.l.substring(temp.l.indexOf(prefix) + prefix.length, temp.l.length - 7));
						if(_speed > speed){
							node = temp;
						}
					}
				}
				if(node == null){
					reject(new Error("无可用节点"));
				} else {
					resolve(node);
				}
			})
			.catch(function(err){
				console.log('请求失败：', err);
				reject(err);
			});
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

GetAccount().then(function(dto){
	return WriteConfigToLocal(dto);
}).then(function(cfg){
	console.log("获取到最新配置为：", cfg);
	console.log("配置更新成功～");
}).catch(function(err){
	console.log("配置更新失败～", err);
});

