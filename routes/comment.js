var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
var method = require('./method.js');
//获得评论列表
router.post('/getComment', function (req, res) {
	var topicID = req.body.topicID;
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('select * from comment where topicID = "'+topicID+'"', function (err, result) {
			if (err) {
				throw err;
				res.send('5');
			} else {
				
				res.send(result);
				return;
			}
		});

		connection.release();
	});
});
//添加评论
router.post('/addComment', function (req, res) {
    var topicID = req.body.topicID;
    var userName = req.body.userName;
    var commentTime = method.getNowFormatDate();
    var content = req.body.content;
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
        var sql = 'insert into comment (userName,topicID,commentTime,content) values("'+userName+'","'+topicID+'","'+commentTime+'","'+content+'")';
        console.log(sql)
		connection.query(sql, function (err, result) {
			if (err) {
				throw err;
				res.send('5');
			} else {
				
				res.send('1');
				return;
			}
		});

		connection.release();
	});
});
module.exports = router;
