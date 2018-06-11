var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
var method = require('./method.js');
var fs = require('fs');
//获得场地列表
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
//获得活动列表
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
//发起活动
router.post('/addAct', function (req, res) {
	var userID = req.body.userID,
		actName = req.body.actName,
		actTime = req.body.actTime,
		actPlace = req.body.actPlace,
		actNum = req.body.actNum,
		actCutOffTime = req.body.actCutOffTime,
		actPrice = req.body.actPrice,
		billingMethods = req.body.billingMethods,
		actExplain = req.body.actExplain,
		actClass = req.body.actClass,
		actStatus = '未开始',
		imgData = req.body.imgData;
		

	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	var fileName,imgName;
	if(imgData){
		fileName = 'act'+ userID + method.getNowFormatDate()+'.jpg';
		imgName = 'http://39.107.66.152:8080/upload/'+fileName;
	    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	    var dataBuffer = new Buffer(base64Data, 'base64');
	    fs.writeFile('./public/upload/'+fileName, dataBuffer, function(err) {
	        if(err){
	          res.send(err);
	        }else{
	        }
	    });
	}else{
		imgName = 'http://39.107.66.152:8080/upload/201805021010.jpg';
	}
  pool.getConnection(function (err, connection) {
        var sql = 'INSERT INTO activity (actName, actTime,actPlace,actNum,actLackNum,actCutOffTime,actStatus,imgURL,actPrice,billingMethods,actExplain,userID,actPeople,actClass)' 
	+ 'VALUES ("' + actName + '","' + actTime + '","' + actPlace + '","' + actNum + '","' + actNum + '","' + actCutOffTime + '","' + actStatus + '","' + imgName + '","' + actPrice+ '","' + billingMethods+ '","' + actExplain+ '","' + userID+'","' + '[]'+'","' + actClass + '") ';
        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
                res.send('0');//修改失败
                return;
            }else{
                res.send('1');
                return;
            }
        });
        connection.release();
    }); 



});
//报名活动
router.post('/signUpAct', function (req, res) {
	var actID = req.body.actID,
		userID = req.body.userID;

	//定义数据库连接池
	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		var sql = 'select actLackNum,actPeople from activity where actID = "'+actID+'"';
		
		console.log(sql)
		connection.query(sql, function (err, result) {
			if (err) {
				throw err;
				res.send('5');//5数据库连接出错
			} else {
				console.log( typeof result[0].actLackNum)
				if(result[0].actLackNum == 0){
					res.send('2')//活动人数报满
					return;
				}else{
					var newNum = result[0].actLackNum-1;
					console.log(newNum)
					var newPeople = result[0].actPeople == ''?userID:result[0].actPeople+','+userID;
					console.log(newPeople)
					
					var sql = 'update activity set actLackNum=\''+newNum+'\',actPeople=\''+newPeople+'\' where actID = \''+actID+'\'';
					console.log(sql)
					connection.query(sql ,function(err,result){
						if(err){
							res.send('0');//报名失败
							throw err;
							return;
						}else{
							res.send('1');//报名成功
							return;
						}
					});
				}
				
				
			}
		});
		connection.release();
	});

});
module.exports = router;
