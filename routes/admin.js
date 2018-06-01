var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var mysql  = require('mysql');

var EventEmitter=require('events').EventEmitter;
var emitter=new EventEmitter();

//修改管理员密码
router.post('/changePWD', function(req, res) {
	var username = req.body.username,
		password = req.body.password;
	console.log(username+password);
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('update useradmin set password=\''+password+'\' where username = \''+username+'\'', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				res.send('1');
				return;
			}
		});

		connection.release();
	});
});

//删除管理员
router.post('/rmAdministrator', function(req, res) {
	var username = req.body.username;

	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('delete from useradmin where username = \''+username+'\'', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				res.send('1');
				return;
			}
		});

		connection.release();
	});
});
//添加管理员
router.post('/addAdministrator', function(req, res) {
	var username = req.body.username,
		password = req.body.password;

	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('insert into useradmin (username,password,class) values ("'+username+'","'+password+'","admin")', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				res.send('1');
				return;
			}
		});

		connection.release();
	});
});

//后台管理获取场地信息
router.get('/store', function(req, res) {

	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	
	pool.getConnection(function (err, connection) {
		let adminArr=[];
		var sql = 'select * from vanue';
		console.log(sql)
		connection.query(sql,function(err,result){
			if(err) throw err;
			else{
				console.log(result)	
				for(var i=0;i<result.length;i++){
					var obj = {};
					obj.vanueID = result[i].vanueID;
					obj.vanueName = result[i].vanueName;
					obj.vanuePlace = result[i].vanuePlace;
					obj.vanueAssess = result[i].vanueAssess;
					obj.vanueOrder = result[i].vanueOrder;
					obj.vanuePrice = result[i].vanuePrice;
					obj.vanueClass = result[i].vanueClass;
					obj.imgURL = result[i].imgURL;
					adminArr.push(obj);
				}
				res.send(adminArr)

			}
		});

		connection.release();
	});
});



module.exports = router;
