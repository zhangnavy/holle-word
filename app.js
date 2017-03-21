var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require("express-session");
//将session保存到数据库
var MongoStore=require("connect-mongo")(session);
var flash=require("connect-flash");

var index = require('./routes/index');
var users = require('./routes/users');
var article=require('./routes/article');
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express)

app.use(session({
  secret: 'come',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url:require("./dbUrl").dbUrl
  })
}));
app.use(flash())

app.use(logger('dev'));
/*app.use(bodyParser.json());*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
  res.locals.user=req.session.user;//获取session中用户登录的信息
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.keyword=req.session.keyword;
  next()
})
app.use('/', index);
app.use('/users', users);
app.use('/article',article)



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
