//var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//
//var index = require('./routes/index');
//var users = require('./routes/users');
//
//var app = express();
//
////跨域请求
//app.all('*', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//  res.header("X-Powered-By",' 3.2.1')
//  res.header("Content-Type", "application/json;charset=utf-8");
//  next();
//});
//
//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//
//// uncomment after placing your favicon in /public
////app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//
////app.use('/', index);
//app.use('/users', users);
//
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//var err = new Error('Not Found');
//err.status = 404;
//next(err);
//});
//
//// error handler
//app.use(function(err, req, res, next) {
//// set locals, only providing error in development
//res.locals.message = err.message;
//res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//// render the error page
//res.status(err.status || 500);
//res.render('error');
//});
//
//var server = app.listen(8080, function () {
////var host = server.address().address;
////var port = server.address().port;
//console.log('启动服务'); 
//});
//
//module.exports = app;


var express = require('express');
var app = express();
var bodyParser = require('body-parser');


//加载路由模块
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var mine = require('./routes/mine');
var sport = require('./routes/sport');
var comment = require('./routes/comment');
var chat = require('./routes/chat');
var admin = require('./routes/admin');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//为了能解析post参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));



//使用路由
app.use('/',index);

app.use('/login',login);
app.use('/users',users);
app.use('/register',register);
app.use('/mine',mine);
app.use('/sport',sport);
app.use('/comment',comment);
app.use('/chat',chat);
app.use('/admin',admin);





//静态文件管理
app.use(express.static('public'));

var server = app.listen(8080, function () {
//var host = server.address().address;
//var port = server.address().port;

console.log('启动服务'); 
});
app.ready=function(server){
    chat.prepareSocketIO(server);
  };
module.exports = app;
