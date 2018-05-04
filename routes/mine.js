var express = require('express');
var router = express.Router();
var  mysql  =  require('mysql');
var method = require('./method.js');
var fromidable = require('formidable');
var fs=  require('fs');
// var multer = require('multer');
var path = require('path');


// var myPath = multer({dest:'./public/upload/'});
// express.use(myPath.any());

/* GET users listing. */
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
                res.send('0');//上传失败
                return;
            }else{
                console.log(result);
                res.send(result);//上传成功
                return;
            }
        });
        connection.release();
    }); 
	// res.send('mine');
});


//对头像的修改保存
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
                var avatarName = 'http://localhost:8080/upload/'+fileName;
                var sql = 'update userInfo set avatar=\''+avatarName+'\' where userID = \''+fields.userID+'\'';
                connection.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                        res.send('0');//上传失败
                        return;
                    }else{
                        res.send('1');//上传成功
                        return;
                    }
                });
                connection.release();
            }); 
        }
    });   
});

//对
module.exports = router;
