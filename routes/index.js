var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var mysql  = require('mysql');

var EventEmitter=require('events').EventEmitter;
var emitter=new EventEmitter();

/* GET home page. */
router.get('/', function(req, res) {
	res.send('index');
	console.log('index');
});

//GET register
// router.get('/register',function(req,res){

// 	//配置链接数据库的信息
// 	var connection = mysql.createConnection({
// 		  	host     : 'localhost',
// 		  	user     : 'root',
// 		  	password : '',
// 		  	database : 'yuedong'
// 		});
// 	//连接数据库	
// 	connection.connect(function(err){
		
// 		if(err){
// 		  	console.log('Database connection error');
// 		}else{
// 		    console.log('Database connection successful');
// 		}
// 		console.log('连接到数据库');
// 	});
// 	//获取前台发送的用户名和密码
// 	var str = url.parse(req.url).query;
// 	var arr = str.split('&');
// 	var userID = arr[1].split('=')[1];
// 	var password = arr[2].split('=')[1];
// 	//查询所有信息
// 	var sql = 'select * from userInfo';	
// 		//用exist判断用户名是否已经存在
// 	var exist = true;
// 	connection.query(sql,function(err,result){
		
// 		if(err){
// 			console.log('select error',err.message);
// 			return;
// 		}
// 		console.log('完成查询');
// 		for(var i=0;i<result.length;i++){
// 			var user = result[i].userID;
// 			console.log(userID+','+user);
// 			if(userID == user){
// 				res.send('0');
// 				return;
// 			}
// 		}
// 	});
	
// 		//插入注册的用户信息到userInfo表
// 		var ins = 'INSERT INTO userinfo (userID, password) VALUES ('+userID+','+ password+') ';
// 		connection.query(ins,function(err,result){
// 			if(err){
// 				console.log('select error',err.message);
// 				return;
// 			}
// 		});
		
// 		res.send('1');

	
// 	connection.end(function(err) {
// 	});	
// });

module.exports = router;
