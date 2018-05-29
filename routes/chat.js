var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');
var mysql = require('mysql');
var method = require('./method');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('0');
});
//按手机号搜索用户
router.post('/searchFriend', function (req, res) {
    var friendTel = req.body.friendTel;

    //定义数据库连接池
    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });
    pool.getConnection(function (err, connection) {
        connection.query('select * from userInfo where telNumber = "' + friendTel + '"', function (err, result) {
            if (err) {
                throw err;
                res.send('5');//5数据库连接出错
            } else {
                res.send(result);
                return;
            }
        });

        connection.release();
    });
});

//获得自己的好友列表
router.post('/getFriendList', function (req, res) {
    var userID = req.body.userID;
    var friendArr = [];
    var returnArr = [];
    var num = 0;
    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });
    pool.getConnection(function (err, connection) {
        connection.query('select * from friendShip where friendFrom = "' + userID + '" or friendTo = "' + userID + '"', function (err, result) {
            if (err) {
                throw err;
                res.send('5');//5数据库连接出错
            } else {
                var p = new Promise(
                    function (resolve, reject) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].friendFrom != 'userID') {
                                friendArr.push(result[i].friendFrom)
                            } else if (result[i].friendTo != 'userID') {
                                friendArr.push(result[i].friendTo)
                            }
                        }
                        resolve(friendArr);
                    })
                p.then(function (friendArr) {
                    connection.query('select * from userInfo where userID in (' + friendArr + ')', function (err, result) {
                        if (err) {
                            throw err;
                        } else {
                            res.send(result)
                        }
                    })
                })
            }
        });
        connection.release();
    });
});

//获得好友聊天信息
router.post('/getFriendMessage', function (req, res) {
    var userID = req.body.userID,
        friendID = req.body.friendID;
    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });
    pool.getConnection(function (err, connection) {
        connection.query('select * from message where messageFrom = "' + userID + '" and messageTo = "' + friendID + '"', function (err, result) {
            if (err) {
                throw err;
                res.send('5');//5数据库连接出错
            } else {
                
            }
        });
        connection.release();
    });
});
//聊天
router.prepareSocketIO = function (server) {
    //存储所有在线用户
    var arrAllSocket = {};
    var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {
        //用户连接聊天服务器
        socket.on('join', function (username) {
            user = username;
            arrAllSocket['用户' + user] = socket; 
            console.log(user+'加入聊天')  ;
            //返回未读消息，将未读消息设置为已读
            let pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yuedong'
            });
            pool.getConnection(function (err, connection) {
                connection.query('select * from message where messageTo = "' + user + '" and status = "未读"', function (err, result) {
                    if (err) {
                        throw err;
                    } else {
                        for(var i=0;i<result.length;i++){
                            if(result[i].class == 'addFriend'){
                                arrAllSocket['用户'+user].emit('addFriendReq',result[i]);
                            }else if(result[i].class == 'message'){
                                arrAllSocket['用户'+user].emit('pmsg',result[i]);
                            }
                        }
                        connection.query('update message set status = "已读" where messageTo = "'+user+'"',function(err,result){
                            if(err) throw err;
                        })
                    }
                });
                connection.release();
            });
        });
        socket.on('disconnect', function () {
            for (var i in arrAllSocket) {
                if (arrAllSocket[i].id == socket.id) {
                    console.log('移除' + i + '--' + arrAllSocket[i].id);
                    delete arrAllSocket[i];
                }
            }
        });
        socket.on('private_message', function (from, to, msg) {
            console.log('触发私聊  ' + from + '   to   ' + to);
            var target = arrAllSocket['用户' + to];
            //目标用户在线
            if (target) {
                target.emit("pmsg", from, to, msg);
            }
            //目标用户不在线
            else {
                console.log('存储为离线消息')
                let pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yuedong'
                });
                pool.getConnection(function (err, connection) {
                    var sql = 'INSERT INTO message (messageFrom,messageTo,messageContent,messageTime,status,class) VALUES ("'+from+'","'+to+'","'+msg+'","'+method.getNowFormatDate()+'","未读","message")';
                    console.log(sql);
                    connection.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        } 
                        connection.release();
                    });
                })
            }
        });   
        socket.on('addFriend', function (from, to, msg) {
            var target1 = arrAllSocket['用户' + to];
            // console.log(target1)
            if (target1) {
                target1.emit('addFriendReq', from, to, msg);
            } else {
                let pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yuedong'
                });
                pool.getConnection(function (err, connection) {
                    var sql = 'INSERT INTO message (messageFrom,messageTo,messageContent,messageTime,status,class) VALUES ("'+from+'","'+to+'","'+msg+'","'+method.getNowFormatDate()+'","未读","addFriend")';
                    console.log(sql);
                    connection.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        } 
                        connection.release();
                    });
                })
            }
        });
        socket.on('addFriendOk', function (from, to) {
            //添加朋友关系
            let pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yuedong'
            });
            pool.getConnection(function (err, connection) {
                connection.query('INSERT INTO friendShip (friendFrom,friendTo) VALUES ("' + from + '","' + to + '")', function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
                connection.release();
            });
        });
        socket.on('sendMSG', function (msg) {
            socket.emit('chat', socket.user, msg);
            socket.broadcast.emit('chat', socket.user, msg);
            console.log(msg);
        });

    });

};

module.exports = router;


