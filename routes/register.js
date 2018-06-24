var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var method = require('./method.js');


router.post('/', function (req, res) {

	//获得用户名和密码
	var telNumber = req.body.telNumber;
	var password = method.md5s(req.body.password);
	avatar = 'http://39.107.66.152:8080/upload/user10201806241811.jpg',
	sign = '这个人真懒，啥都没留下';


	//定义数据库连接池
	var pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});

	pool.getConnection(function (err, connection) {
		//查询所有信息
		var sql = 'select * from userInfo';
		//用exist判断用户名是否已经存在
		var exist = false;
		connection.query(sql, function (err, result) {
			if (err) {
				console.log('查询错误', err.message);
				res.send('5');//5链接数据库出错
				return;
			}
			for (var i = 0; i < result.length; i++) {
				var user = result[i].telNumber;
				if (telNumber == user) {
					exist = true;
					res.send('0');
					return;
				}
			}
			if (!exist) {
				// 		//插入注册的用户信息到userInfo表
				var ins = 'INSERT INTO userInfo (userName, password,telNumber,mail,signature,avatar) VALUES ("' + ('用户'+telNumber) + '","' + password + '","' + telNumber + '","' + null + '","' + sign + '","' + avatar + '") ';
				connection.query(ins, function (err, result) {
					if (err) {
						console.log('插入错误', err.message);
						return;
					}
					res.send('1');
					return;
				});
			}
			connection.release();
		});
	});
});

module.exports = router;
