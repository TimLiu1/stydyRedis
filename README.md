   使用redis最缓存，我们最常用的场景就是有一个对象，对象里面存在很多键值对，所以redis里面的hash类型就特别适合做缓存,下面我就一个小例子来说明redis如何使用redis最缓存的。
	 
安装redis

    npm install redis --save

我们还会用到Promise的方法来操作数据库，所以安装bluebird
    
	npm install bluebird

[bluebird教程推荐](http://bluebirdjs.com/docs/api-reference.html)


配置参数
```	 
let config = {
    "port": 6379,
    "host": "localhost",
    "options": {}
};
```
依赖包引入
```
let redis = require('redis');
let Promise = require('bluebird');
```
定义对象
```
let client = null;
let cache = function () {
		//创建客户端
    client = redis.createClient(config.port, config.host, config.options);
    return {
			//写入hash类型的数据
        put: function (cacheName, key, value, cb) {
            let str = JSON.stringify(value);
            client.hset(cacheName, key, str, cb);
        },
				//获取hash数据
        get: function (cacheName, key, cb) {
            client.hget(cacheName, key, (err, result) => {
                if (err) {
                    return cb(err);
                }
                console.log(typeof result);
                return cb(null, JSON.parse(result));
            });
        },
				//删除hash数据
         del: function (cacheName, key, cb) {
            client.hdel(cacheName, key, cb);
        }
    }
}
```
函数调用
```
let cli = cache();
let tim = { age: '19', high: 170 }
cli.put('people', 'tim', tim, function (err, result) {
    if (err) {
        console.log("err: " + err);
    } else {
        console.log(result)
    }
})

cli.get('people', 'tim', (err, result) => {
    console.log(result)
})
```
使用Promise来操作对象
```
//使该对象可使用Promise同步流程
Promise.promisifyAll(cli);
//读操作
let lisa = { age: 22, high: 158 };
cli.putAsync('people', 'lisa', lisa).then((result) => {
    console.log(result)
}).catch((err) => {
    console.log('err:' + err)
})
//写操作
cli.getAsync('people', 'lisa').then((result) => {
    console.log(result)
}).catch((err) => {
    console.log('err:' + err)
})
```

	 
	 
