var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
var method = require('./method.js');
var fromidable = require('formidable');
var Buffer = require('buffer').Buffer;
var fs=  require('fs');
var path = require('path');
//定义数据库连接池
 let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });

//我的模块的信息请求
router.post('/', function (req, res) {
    var userID = req.body.userID;
   
    pool.getConnection(function (err, connection) {
        var sql = 'select userName,telNumber,signature,avatar from userInfo where userID="'+userID+'"';
        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
                res.send('0');
                return;
            }else{
                res.send(result);
                return;
            }
        });
        connection.release();
    }); 
	// res.send('mine');
});

//用户修改头像模块
router.post('/chAvatar',function(req,res,next){
 	var userID = req.body.userID;
 	var imgData = req.body.imgData;
 	var fileName = 'user'+ userID + '.jpg';
 	
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile('./public/upload/'+fileName, dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          pool.getConnection(function (err, connection) {
                var avatarName = 'http://39.107.66.152:8080/upload/'+fileName;
                var sql = 'update userInfo set avatar=\''+avatarName+'\' where userID = \''+userID+'\'';
                connection.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                        res.send('0');//修改失败
                        return;
                    }else{
                        res.send({avatar:avatarName});//修改成功
                        return;
                    }
                });
                connection.release();
            }); 
        }
    });
 	

 	console.log(fileName);

 	
 	
 	
});
//修改基本信息模块
router.post('/changeMsg',function(req,res){
    var userID = req.body.userID,
        telNumber = req.body.telNumber,
        userSign = req.body.userSign,
        userName = req.body.userName;

       
        pool.getConnection(function (err, connection) {
            var sql = 'update userInfo set userName=\''+userName+'\',telNumber=\''+telNumber+'\', signature=\''+userSign+'\' where userID="'+userID+'"';

            connection.query(sql, function (err, result) {
                if (err) {
                    throw err;
                    res.send('0');//修改失败
                    return;
                }else{
                    console.log(result);
                    res.send('1');//修改成功
                    return;
                }
            });
            connection.release();
        }); 
});

//修改密码模块
router.post('/changePwd',function(req,res){
    var userID = req.body.userID,
        originPwd = method.md5s(req.body.originPwd),
        newPwd = method.md5s(req.body.newPwd);
    console.log(req.body);
    // console.log(userName)

        pool.getConnection(function (err, connection) {
            var sql = 'select password from userInfo where userID="'+userID+'"';
            console.log(sql)
            connection.query(sql, function (err, result) {
                if (err) {
                    throw err;
                    res.send('5');
                    return;
                }else{
                    if(result[0].password == originPwd){
                        connection.query('update userInfo set password=\''+newPwd+'\' where userID = "'+userID+'"',function(err,result){
                            if(err){
                                throw err;
                                res.send('0');
                                return;
                            }else{
                                res.send('1');
                                return;
                            }
                        });
                    }else{
                        res.send('2');
                        return;
                    }
                    
                }
            });
            connection.release();
        }); 
});

//对
module.exports = router;
