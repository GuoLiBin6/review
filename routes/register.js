var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var method = require('./method.js');


router.post('/', function (req, res) {

	//获得用户名和密码
	var telNumber = req.body.telNumber;
	var password = method.md5s(req.body.password);


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
				var ins = 'INSERT INTO userInfo (userID,userName, password,telNumber,mail,signature,avatar) VALUES ("' + method.getNowFormatDate() + '","' + ('用户'+method.getNowFormatDate()) + '","' + password + '","' + telNumber + '","' + null + '","' + null + '","' + null + '") ';
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
