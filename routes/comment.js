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
    var userID = req.body.userID;
    var commentTime = method.getNowFormatDate1();
    var content = req.body.content;
	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		var sql0 = 'select * from userInfo where userID = "'+userID+'"';
		connection.query(sql0, function (err, result) {
			if (err) {
				throw err;
				res.send('5');
			} else {
				connection.query('select topicNum from topic where topicID ="'+topicID+'"',function(err,result){
					if(err) throw err;
					else{
						var num = result[0].topicNum + 1;
						connection.query('update topic set topicNum=\''+num+'\' where topicID = \''+topicID+'\'',function(err,result){})
					}
				})
				var userName = result[0].userName,
					avatar = result[0].avatar;
        		var sql = 'insert into comment (userName,topicID,commentTime,content,avatar) values("'+userName+'","'+topicID+'","'+commentTime+'","'+content+'","'+avatar+'")';
				connection.query(sql,function(err,result){
					if(err) throw err;
					else{
						res.send('1');
					}
				})

				return;
			}
		});

		connection.release();
	});
});
module.exports = router;
