var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
var method = require('./method.js');
/* GET users listing. */
router.post('/', function (req, res) {
	//获得用户名和密码
	var userName = req.body.userName;
	var password = method.md5s(req.body.password);
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('select * from userInfo', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				for (var i = 0;i<result.length;i++){ 
					if( result[i].telNumber == userName || result[i].userName == userName ){
						if(result[i].password == password){
							res.send({userID:result[i].userID});
							return;
						}else{
							res.send('2');
							return;
						}
					}
				}
				res.send('0');
				return;
			}
		});

		connection.release();
	});
});
router.post('/admin', function (req, res) {
	//获得用户名和密码
	var userName = req.body.username;
	var password = req.body.password;
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('select * from userAdmin', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				for (var i = 0;i<result.length;i++){ 
					if( result[i].username == userName&&result[i].password == password){
						if(result[i].class == 'admin'){
							res.send('1');
							return;
						}else if(result[i].class == 'root'){
							res.send('2');
							return;
						}
						
					}
				}
				res.send('0');
				return;
			}
		});

		connection.release();
	});
});
module.exports = router;
