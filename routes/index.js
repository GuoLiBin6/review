var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var mysql  = require('mysql');

var EventEmitter=require('events').EventEmitter;
var emitter=new EventEmitter();

/* GET home page. */
router.get('/', function(req, res) {

	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('select * from home', function (err, result) {
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

router.get('/goodTopic', function(req, res) {

	let pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'yuedong'
	});
	pool.getConnection(function (err, connection) {
		connection.query('select * from topic order by topicID desc limit 5', function (err, result) {
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


module.exports = router;
