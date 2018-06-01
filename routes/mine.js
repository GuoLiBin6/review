var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
var method = require('./method.js');
var fromidable = require('formidable');
var fs=  require('fs');
var path = require('path');



//我的模块的信息请求
router.post('/', function (req, res) {
    var userID = req.body.userID;
    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });
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


//修改头像模块
router.post('/avatar',function(req,res,next){
    var form = new fromidable.IncomingForm();
    //解析req，找到文件
    form.parse(req,function(err,fields,files){
        if(files.modal_file){
            var userId = fields.userID;
            var fileName = fields.userID + files.modal_file.name.substr(files.modal_file.name.indexOf('.'));//获得userID+后缀名的文件名
            console.log(fileName);
            method.rename(files.modal_file.path,fileName)//三个参数为上传前文件目录，文件名，将文件保存到服务器端
            //将上传头像名保存到数据库
            let pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yuedong'
            });
            pool.getConnection(function (err, connection) {
                var avatarName = 'http://39.107.66.152:8080/upload/'+fileName;
                var sql = 'update userInfo set avatar=\''+avatarName+'\' where userID = \''+fields.userID+'\'';
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
//修改基本信息模块
router.post('/changeMsg',function(req,res){
    var userID = req.body.userID,
        telNumber = req.body.telNumber,
        userSign = req.body.userSign,
        userName = req.body.userName;

        let pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'yuedong'
        });
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
        let pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'yuedong'
        });
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
