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
            	if(!result[0]){
            		res.send('0')
            	}else{
            		res.send(result);
            	}
                
            }
        });

        connection.release();
    });
});

//获得自己的好友列表
router.post('/getFriendList', function (req, res) {
    var userID = req.body.userID;
    var friendArr = [];
    var roomInfo = {};
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
                            if (result[i].friendFrom != userID) {
                                friendArr.push(result[i].friendFrom)
                            } else if (result[i].friendTo != userID) {
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
//获得群聊列表
router.get('/getRooms', function (req, res) {
    var userID = '201805021103';
    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });
    pool.getConnection(function (err, connection) {
        connection.query('select * from rooms where roomID = (select roomID from roomPeople where userID = "'+userID+'")', function (err, result) {
            if (err) {
                throw err;
                res.send('5');//5数据库连接出错
            } else {
                res.send(result)
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
    	var sql = 'select * from message where (messageFrom = ' + userID + ' and messageTo = ' + friendID + ') or (messageFrom = '+friendID+' and messageTo = '+userID+')';

        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
                res.send('5');//5数据库连接出错
            } else {
				res.send(result);
            }
        });
        connection.release();
    });
});

//通知
router.post('/getaddFriendList', function (req, res) {
    var userID = req.body.userID;
    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });
    pool.getConnection(function (err, connection) {
    	var sql = 'select m.messageID,m.messageFrom,m.messageContent,m.messageTime,m.status,u.userName from message m,userInfo u where m.messageFrom = u.userID and m.class="addFriend" and m.messageTo ='+userID+' order by m.messageTime desc';

        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
                res.send('5');//5数据库连接出错
            } else {
				res.send(result);
            }
        });
        connection.release();
    });
});
//改变消息为已处理
router.post('/changeStatus', function (req, res) {
    var messageID = req.body.messageID;
    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'yuedong'
    });
    pool.getConnection(function (err, connection) {
    	var sql = 'update message set status = "已处理" where messageID = '+messageID;

        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
                res.send('5');//5数据库连接出错
            } else {
				res.send('1');
            }
        });
        connection.release();
    });
});

//聊天
router.prepareSocketIO = function (server) {
    //存储所有在线用户
    var arrAllSocket = {};
    var roomInfo = {};
    var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {
        //用户连接聊天服务器
        socket.on('join', function (username) {
            user = username;
            arrAllSocket['用户' + user] = socket;
            console.log(user + '加入聊天');
            //返回未读消息，将未读消息设置为已读
            let pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yuedong'
            });
            //未读
            pool.getConnection(function (err, connection) {
                connection.query('select * from message where messageTo = "' + user + '" and status = "未读"', function (err, result) {
                    if (err) {
                        throw err;
                    } else {
                    	console.log(result.length);
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].class == 'addFriend') {
                                arrAllSocket['用户' + user].emit('addFriendReq', result[i]);
                            } else if (result[i].class == 'message') {
                                arrAllSocket['用户' + user].emit('pmsg', result[i]);
                            }else if(result[i].class == 'addRoom'){
                                arrAllSocket['用户' + user].emit('addRoomReq', result[i]);
                            }
                        }
                        connection.query('update message set status = "已读" where messageTo = ' + user + ' and status = "未读"', function (err, result) {
                            if (err) throw err;
                        })
                    }
                });
                connection.release();
            });
        });
        //用户断线从用户列表移除
        socket.on('disconnect', function () {
            for (var i in arrAllSocket) {
                if (arrAllSocket[i].id == socket.id) {
                    console.log('移除' + i + '--' + arrAllSocket[i].id);
                    delete arrAllSocket[i];
                }
            }
        });
        //私聊
        socket.on('private_message', function (from, to, msg) {
            console.log('触发私聊  ' + from + '   to   ' + to);
            var target = arrAllSocket['用户' + to];
            //目标用户在线
            if (target) {
                target.emit("pmsg", from, to, msg);
                let pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yuedong'
                });
                pool.getConnection(function (err, connection) {
                    var sql = 'INSERT INTO message (messageFrom,messageTo,messageContent,messageTime,status,class) VALUES ("' + from + '","' + to + '","' + msg + '","' + method.getNowFormatDate1() + '","已读","message")';
                    console.log(sql);
                    connection.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        connection.release();
                    });
                })
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
                    var sql = 'INSERT INTO message (messageFrom,messageTo,messageContent,messageTime,status,class) VALUES ("' + from + '","' + to + '","' + msg + '","' + method.getNowFormatDate1() + '","未读","message")';
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
        //添加好友
        socket.on('addFriend', function (from, to, msg) {
            var target1 = arrAllSocket['用户' + to];
            // console.log(target1)
            if (target1) {
                target1.emit('addFriendReq', from, to, msg);
                let pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yuedong'
                });
                pool.getConnection(function (err, connection) {
                    var sql = 'INSERT INTO message (messageFrom,messageTo,messageContent,messageTime,status,class) VALUES ("' + from + '","' + to + '","' + msg + '","' + method.getNowFormatDate1() + '","已读","addFriend")';
                    console.log(sql);
                    connection.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        connection.release();
                    });
                })
            } else {
                let pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yuedong'
                });
                pool.getConnection(function (err, connection) {
                    var sql = 'INSERT INTO message (messageFrom,messageTo,messageContent,messageTime,status,class) VALUES ("' + from + '","' + to + '","' + msg + '","' + method.getNowFormatDate1() + '","未读","addFriend")';
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
         //申请加入群聊
         socket.on('addRoom', function (from, to, msg) {
            var target1 = arrAllSocket['用户' + to];
            // console.log(target1)
            if (target1) {
                target1.emit('addRoomReq', from, to, msg);
            } else {
                let pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yuedong'
                });
                pool.getConnection(function (err, connection) {
                    var sql = 'INSERT INTO message (messageFrom,messageTo,messageContent,messageTime,status,class) VALUES ("' + from + '","' + to + '","' + msg + '","' + method.getNowFormatDate1() + '","未读","addRoom")';
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
        //确认添加好友
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
        //确认加入群聊
        socket.on('addRoomOk', function (from, room) {
            //添加朋友关系
            let pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yuedong'
            });
            pool.getConnection(function (err, connection) {
                connection.query('INSERT INTO roomPeople (roomID,userID) VALUES ("' + from + '","' + room + '")', function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
                connection.release();
            });
        });
        //加入群聊
        socket.on('joinRoom', function (userName) {
            var user = userName,
                roomID = 'room201805021013';
            if (!roomInfo[roomID]) {
                roomInfo[roomID] = [];
            }
            roomInfo[roomID].push(user);
            console.log(roomInfo)
            socket.join(roomID);
            io.sockets.to(roomID).emit('pmsg', user + '加入了房间', roomInfo[roomID]);

            socket.on('leave', function () {
                socket.emit('disconnect');
            });

            socket.on('disconnect', function () {
                // 从房间名单中移除
                var index = roomInfo[roomID].indexOf(user);
                if (index !== -1) {
                    roomInfo[roomID].splice(index, 1);

                }

                socket.leave(roomID); // 退出房间
                // if(roomInfo[roomID].length == 0){
                //     delete roomInfo[roomID];
                // }   
                io.sockets.to(roomID).emit('pmsg', user + '退出了房间', roomInfo[roomID]);
                console.log(user + '退出了' + roomID);
                console.log(roomInfo);
            });
            // 接收用户消息,发送相应的房间
            socket.on('message', function (msg) {
                // 验证如果用户不在房间内则不给发送
                if (roomInfo[roomID].indexOf(user) === -1) {
                    return false;
                }
                io.sockets.to(roomID).emit('pmsg', user, msg);
            });
        });

    });

};

module.exports = router;


