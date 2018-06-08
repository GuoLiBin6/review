var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var method = require('./method');
var mysql  = require('mysql');
var fromidable = require('formidable');
var path = require('path');

var EventEmitter=require('events').EventEmitter;
var emitter=new EventEmitter();

//定义数据库连接池
let pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'yuedong'
});
//修改管理员密码
router.post('/changePWD', function(req, res) {
	var username = req.body.username,
		password = req.body.password;
	console.log(username+password);

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
//修改管理员头像模块
router.post('/adminUserAvatar',function(req,res,next){
    var form = new fromidable.IncomingForm();
    //解析req，找到文件
    form.parse(req,function(err,fields,files){
        if(files.modal_file){
            var userId = fields.userID;
            var fileName = 'adminuser'+fields.userID + files.modal_file.name.substr(files.modal_file.name.indexOf('.'));//获得userID+后缀名的文件名
            console.log(fileName);
            method.rename(files.modal_file.path,fileName)//三个参数为上传前文件目录，文件名，将文件保存到服务器端
            //将上传头像名保存到数据库
            pool.getConnection(function (err, connection) {
                var avatarName = 'http://39.107.66.152:8080/upload/'+fileName;
                var sql = 'update useradmin set imgURL=\''+avatarName+'\' where useradminID = \''+fields.userID+'\'';
                connection.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                        res.send('0');//修改失败
                        return;
                    }else{
                        res.send('1');//修改成功
                        return;
                    }
                });
                connection.release();
            }); 
        }
    });   
});

//删除管理员
router.post('/rmAdministrator', function(req, res) {
	var username = req.body.username;


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

	pool.getConnection(function (err, connection) {
		connection.query('insert into useradmin (username,password,class,imgURL) values ("'+username+'","'+password+'","admin","http://39.107.66.152:8080/upload/201805021010.jpg")', function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				connection.query('select useradminID from useradmin where username= "'+username+'"',function(err,result){
					if(err) throw err;
					else{
						res.send({id:result[0].useradminID})
					}
				})
			}
		});

		connection.release();
	});
});

//后台管理获取场地信息
router.post('/store', function(req, res) {
	var page_size = req.body.page_size,
		cur_page = req.body.cur_page;
		

	
	pool.getConnection(function (err, connection) {
		let adminArr=[];
		var from,sql;
		
		if(page_size == 'all'){
			sql = 'select * from vanue';
		}else{
			from = (cur_page - 1) * page_size;
			sql = 'select * from vanue limit '+from+','+page_size;
		}

		connection.query(sql,function(err,result){
			if(err) throw err;
			else{

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
					obj.telNumber = result[i].telNumber;
					adminArr.push(obj);
				}
				res.send(adminArr)

			}
		});

		connection.release();
	});
});
//修改场馆信息
router.post('/changeVanue', function(req, res) {
	var id=req.body.vanueID,
		name = req.body.vanueName,
		place = req.body.vanuePlace,
		price = req.body.vanuePrice,
		clas = req.body.vanueClass,
		order = req.body.vanueOrder,
		tel = req.body.telNumber,
		assess = req.body.vanueAssess;


	pool.getConnection(function (err, connection) {
		var sql = "update vanue set vanueName= '"+name+"',vanuePlace = '"+place+"',vanuePrice = '"+price+"',vanueClass='"+clas+"',vanueOrder='"+order+"',vanueAssess='"+assess+"',telNumber = '"+tel+"' where vanueID = '"+id+"'";
		console.log(sql)
		connection.query(sql, function (err, result) {
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

//删除场馆
router.post('/rmVanue', function(req, res) {
	var arr = req.body.delArr;

	pool.getConnection(function (err, connection) {
		for(var i=0;i<arr.length;i++){
			connection.query('delete from vanue where vanueID = \''+arr[i]+'\'', function (err, result) {
				if (err) {
					throw err;
					res.send('5');
					return;//5数据库连接出错
				}
			});
		}
		res.send('1');
		

		connection.release();
	});
});
//添加场地
router.post('/addVanue', function(req, res) {
	var vanueName=req.body.vanueName,
        vanuePlace=req.body.vanuePlace,
        vanueAssess=req.body.vanueAssess,
        vanueOrder=req.body.vanueOrder,
        vanueClass=req.body.vanueClass,
        telNumber=req.body.telNumber,
        vanuePrice = req.body.vanuePrice;


	pool.getConnection(function (err, connection) {
		var sql = 'insert into vanue (vanueName,vanuePlace,vanueAssess,vanueOrder,vanueClass,telNumber,vanuePrice) values ("'+vanueName+'","'+vanuePlace+'","'+vanueAssess+'","'+vanueOrder+'","'+vanueClass+'","'+telNumber+'","'+vanuePrice+'")';
		console.log(sql)
		connection.query(sql, function (err, result) {
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
//添加场地
router.post('/addVanue1',function(req,res,next){
    var form = new fromidable.IncomingForm();
    //解析req，找到文件
    form.parse(req,function(err,fields,files){
        if(files.modal_file){
            var vanueName=fields.vanueName,
		        vanuePlace=fields.vanuePlace,
		        vanueAssess=fields.vanueAssess,
		        vanueOrder=fields.vanueOrder,
		        vanueClass=fields.vanueClass,
		        telNumber=fields.telNumber,
		        vanuePrice = fields.vanuePrice;
            var fileName = 'vanue'+method.getNowFormatDate() + files.modal_file.name.substr(files.modal_file.name.indexOf('.'));//获得userID+后缀名的文件名
            console.log(fileName);
            method.rename(files.modal_file.path,fileName)//三个参数为上传前文件目录，文件名，将文件保存到服务器端
            //将上传头像名保存到数据库
            pool.getConnection(function (err, connection) {
                var imgurl = 'http://localhost:8080/upload/'+fileName;
				var sql = 'insert into vanue (vanueName,vanuePlace,vanueAssess,vanueOrder,vanueClass,telNumber,vanuePrice,imgURL) values ("'+vanueName+'","'+vanuePlace+'","'+vanueAssess+'","'+vanueOrder+'","'+vanueClass+'","'+telNumber+'","'+vanuePrice+'","'+imgurl+'")';
                
                connection.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                        res.send('0');//修改失败
                        return;
                    }else{
                        res.send('1');//修改成功
                        return;
                    }
                });
                connection.release();
            }); 
        }
    });   
});
//后台管理获取用户信息
router.post('/user', function(req, res) {
	var page_size = req.body.page_size,
		cur_page = req.body.cur_page;
		

	pool.getConnection(function (err, connection) {
		let adminArr=[];
		var from,sql;
		
		if(page_size == 'all'){
			sql = 'select * from userInfo';
		}else{
			from = (cur_page - 1) * page_size;
			sql = 'select * from userInfo limit '+from+','+page_size;
		}

		connection.query(sql,function(err,result){
			if(err) throw err;
			else{

				for(var i=0;i<result.length;i++){
					var obj = {};
					obj.userID = result[i].userID;
					obj.userName = result[i].userName;
					obj.telNumber = result[i].telNumber;
					obj.mail = result[i].mail;
					obj.signature = result[i].signature;
					obj.avatar = result[i].avatar;
					
					adminArr.push(obj);
				}
				res.send(adminArr)

			}
		});

		connection.release();
	});
});
//修改用户信息
router.post('/changeUser', function(req, res) {
	var id=req.body.userID,
		name = req.body.userName,
		mail = req.body.mail,
		signature = req.body.signature,
		telNumber = req.body.telNumber,
		password = req.body.password;
		

	var sql;
	if(password){
		var pwd=method.md5s(password);
		sql = "update userInfo set userName='"+name+"',password='"+pwd+"',mail='"+mail+"',signature='"+signature+"',telNumber='"+telNumber+"' where userID = "+id;
	}else{
		sql = "update userInfo set userName='"+name+"',mail='"+mail+"',signature='"+signature+"',telNumber='"+telNumber+"' where userID = "+id;
	}
	pool.getConnection(function (err, connection) {

		console.log(sql)
		connection.query(sql, function (err, result) {
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
//删除用户
router.post('/rmUser', function(req, res) {
	var arr = req.body.delArr;


	pool.getConnection(function (err, connection) {
		for(var i=0;i<arr.length;i++){
			connection.query('delete from userInfo where userID = \''+arr[i]+'\'', function (err, result) {
				if (err) {
					throw err;
					res.send('5');
					return;//5数据库连接出错
				}
			});
		}
		res.send('1');
		

		connection.release();
	});
});
//后台管理获取活动信息
router.post('/activity', function(req, res) {
	var page_size = req.body.page_size,
		cur_page = req.body.cur_page;

	
	pool.getConnection(function (err, connection) {
		let adminArr=[];
		var from,sql;
		
		if(page_size == 'all'){
			sql = 'select * from activity';
		}else{
			from = (cur_page - 1) * page_size;
			sql = 'select * from activity limit '+from+','+page_size;
		}

		connection.query(sql,function(err,result){
			if(err) throw err;
			else{

				for(var i=0;i<result.length;i++){
					var obj = {};
					obj.actID = result[i].actID;
					obj.actName = result[i].actName;
					obj.actPlace = result[i].actPlace;
					obj.actTime = result[i].actTime;
					obj.actClass = result[i].actClass;
					obj.userID = result[i].userID;
					
					adminArr.push(obj);
				}
				res.send(adminArr)

			}
		});

		connection.release();
	});
});
//删除活动
router.post('/rmActivity', function(req, res) {
	var arr = req.body.delArr;


	pool.getConnection(function (err, connection) {
		for(var i=0;i<arr.length;i++){
			connection.query('delete from activity where actID = \''+arr[i]+'\'', function (err, result) {
				if (err) {
					throw err;
					res.send('5');
					return;//5数据库连接出错
				}
			});
		}
		res.send('1');
		

		connection.release();
	});
});

//修改活动信息
router.post('/changeActivity', function(req, res) {
	var id=req.body.actID,
		name = req.body.actName,
		place = req.body.actPlace,

		clas = req.body.actClass,
		time = req.body.actTime;


	pool.getConnection(function (err, connection) {
		var sql = "update activity set actName= '"+name+"',actPlace = '"+place+"',actClass='"+clas+"',actTime='"+time+"' where actID = '"+id+"'";
		console.log(sql)
		connection.query(sql, function (err, result) {
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

//后台管理获取话题信息
router.post('/topic', function(req, res) {
	var page_size = req.body.page_size,
		cur_page = req.body.cur_page;

	
	pool.getConnection(function (err, connection) {
		let adminArr=[];
		var from,sql;
		
		if(page_size == 'all'){
			sql = 'select * from topic';
		}else{
			from = (cur_page - 1) * page_size;
			sql = 'select * from topic limit '+from+','+page_size;
		}

		connection.query(sql,function(err,result){
			if(err) throw err;
			else{

				for(var i=0;i<result.length;i++){
					var obj = {};
					obj.topicID = result[i].topicID;
					obj.topicName = result[i].topicName;
					obj.topicNum = result[i].topicNum;
					obj.topicTime = result[i].topicTime;
					obj.topicContent = result[i].topicContent;

					
					adminArr.push(obj);
				}
				res.send(adminArr)

			}
		});

		connection.release();
	});
});

//删除话题
router.post('/rmTopic', function(req, res) {
	var arr = req.body.delArr;


	pool.getConnection(function (err, connection) {
		for(var i=0;i<arr.length;i++){
			connection.query('delete from topic where topicID = \''+arr[i]+'\'', function (err, result) {
				if (err) {
					throw err;
					res.send('5');
					return;//5数据库连接出错
				}
			});
		}
		res.send('1');
		

		connection.release();
	});
});
//添加话题
router.post('/addTopic',function(req,res,next){
    var form = new fromidable.IncomingForm();
    //解析req，找到文件
    form.parse(req,function(err,fields,files){
        if(files.modal_file){
            var topicName = fields.topicName,
            	topicContent = fields.topicContent;
            var fileName = 'topic'+method.getNowFormatDate() + files.modal_file.name.substr(files.modal_file.name.indexOf('.'));//获得userID+后缀名的文件名
            console.log(fileName);
            method.rename(files.modal_file.path,fileName)//三个参数为上传前文件目录，文件名，将文件保存到服务器端
            //将上传头像名保存到数据库
            pool.getConnection(function (err, connection) {
                var imgurl = 'http://localhost:8080/upload/'+fileName;
				var sql = 'insert into topic (topicName,topicContent,topicNum,imgURL,topicTime) values ("'+topicName+'","'+topicContent+'","0","'+imgurl+'","'+getNowFormatDate1()+'")';
                
                connection.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                        res.send('0');//修改失败
                        return;
                    }else{
                        res.send('1');//修改成功
                        return;
                    }
                });
                connection.release();
            }); 
        }
    });   
});
/**
 * 获得初始化的本地时间
 * @param  
 * @return 当前时间年月日时分的字符串
 *
 **/
let getNowFormatDate1 = () =>  {
	    let date  =  new  Date();
	    let month  =  date.getMonth()  +  1;
	    let strDate  =  date.getDate();
	let hour = date.getHours();
	let minute = date.getMinutes();
	    if (month  >=  1  &&  month  <=  9)  {
		        month  =  "0"  +  month;
	    }
	    if (strDate  >=  0  &&  strDate  <=  9)  {
		        strDate  =  "0"  +  strDate;
	    }
	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}
	if (minute >= 0 && minute <= 9) {
		minute = "0" + minute;
	}
	    let currentdate  =  date.getFullYear() +'-'  +  month  +'-' +  strDate+' '  + hour +':'  +  minute ;
	    return  currentdate;
}
module.exports = router;
