var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
var method = require('./method.js');

router.get('/', function (req, res) {
	
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('select * from vanue', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				res.send(result);
				return;
				}
				res.send('0');
				return;
			});
			connection.release();
	});

});
//发起活动
router.post('/getActList', function (req, res) {
	var userID = req.body.userID;
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		var sql;
		if (userID == 'all'){
			sql = 'select * from activity';
		}else{
			sql = 'select * from activity where userID ="' + userID + '"';

		}
		console.log(sql)
		connection.query(sql, function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				res.send(result);
				return;
			}
			res.send('0');
			return;
		});
		connection.release();
	});

});

module.exports = router;
