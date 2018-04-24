var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('./config/passport.js');
var routes = require('./routes/index');
var methodOverride = require('method-override');
var multer = require('multer');
var errorHandler = require('errorhandler'); 
var log4js = require('log4js');


var app = express();


log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    menu: {
      type: 'file', //文件输出
      filename: 'logs/access.log',
      replaceConsole: true
    }  
  },
  categories: {
    default: {
      appenders: ['menu'],
      level: 'info'
    }
  }
});

var logger = log4js.getLogger('share');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

// override是为了改变表单提交get/post的请求以适应接口，比如put
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(validator());
app.use(session({
  secret: 'share4mongodb',
  resave: false,
  saveUninitialized: false,
  store:new MongoStore({
      mongooseConnection:mongoose.connection
  }),
  cookie:{maxAge:180*60*1000} //store保存时间
}));
//对session操作的模块，应在session实例下面
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}
app.use('/', express.static(path.join(__dirname, 'public'),options));
// 路由配置
routes(app);
// 错误处理中间件应当在路由加载之后才能加载
if ('development' == app.get('env')) {
  app.use(errorHandler());
}
module.exports = app