let config = {
    "port": 6379,
    "host": "localhost",
    "options": {}
};
let client = null;
let redis = require('redis');
let Promise = require('bluebird');



let cache = function () {
    client = redis.createClient(config.port, config.host, config.options);
    Promise.promisifyAll(client);
    return {
        put: function (cacheName, key, value, cb) {
            let str = JSON.stringify(value);
            client.hset(cacheName, key, str, cb);
        },
        get: function (cacheName, key, cb) {
            client.hget(cacheName, key, (err, result) => {
                if (err) {
                    return cb(err);
                }
                console.log(typeof result);
                return cb(null, JSON.parse(result));
            });
        },
         del: function (cacheName, key, cb) {
            client.hdel(cacheName, key, cb);
        }
    }
}

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

Promise.promisifyAll(cli);
let lisa = { age: 22, high: 158 };
cli.putAsync('people', 'lisa', lisa).then((result) => {
    console.log(result)
}).catch((err) => {
    console.log('err:' + err)
})


cli.getAsync('people', 'lisa').then((result) => {
    console.log(result)
}).catch((err) => {
    console.log('err:' + err)
})
