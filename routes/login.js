var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
/* GET users listing. */
router.post('/', function (req, res) {
	//获得用户名和密码
	var userName = req.body.userName;
	var password = req.body.password;
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	// pool.getConnection(function (err, connection) {
	// 	connection.query('select password from userInfo where userName = "'+userName+'"', function (err, result) {
	// 		if (err) {
	// 			throw err;
	// 			res.send('5');//5数据库连接出错
	// 		} else {
	// 			console.log(result)
	// 			if(result == []){
	// 				res.send('0');//0没有此用户名
	// 			}
	// 			else if(result[0].password != password){
	// 				res.send('2');//2密码错误
	// 			}else if(result[0].password == password){
	// 				res.send('1');//1成功登录
	// 			}
	// 		}
	// 	});

	// 	connection.release();
	// });
	pool.getConnection(function (err, connection) {
		connection.query('select * from userInfo', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				for (var i = 0;i<result.length;i++){
					if(result[i].userName == userName && result[i].password == password){
						res.send('1');
						return;
					}else if(result[i].userName == userName){
						res.send('2');
						return;
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
