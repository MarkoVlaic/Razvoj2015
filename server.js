var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var fs = require('fs');
//var bcrypt = require('bcrypt');

var passport = require('passport');

//routes
var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var profile = require('./routes/profile');
var tasks = require('./routes/tasks');
var follow = require('./routes/follow');
var homepage = require('./routes/homepage');
var search = require('./routes/search');
var addTask = require('./routes/addTask');
var upload = require('./routes/upload');
var fileHandle = require('./routes/fileHandle');
var comments = require('./routes/comments.js');
var notifications = require('./routes/notifications.js');

var mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({
  secret:process.env.SESSION_SECRET || 'secret',
  resave:false,
  saveUninitialized:false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

//connect to the database
dev = false;
if(!dev){
	console.log('Not in dev');
	var conn = mongoose.connect('mongodb://MarkoVlaic:bg14072014@ds035995.mongolab.com:35995/razvojdevelopment',function(){
	  console.log("database connected");
	  // console.log("Bla bla",mongoose.connection.db);
	  // console.log("Ko filip",mongoose.db);
	  process.env.db = mongoose.connection.db;
	});
}else{
	var conn = mongoose.connect('127.0.0.1:27017/projektDb',function(){
	  console.log("database connected");
	  // console.log("Bla bla",mongoose.connection.db);
	  // console.log("Ko filip",mongoose.db);
	  process.env.db = mongoose.connection.db;
	});
}


//connect the routes
app.use('/', index);
app.use('/',login);
app.use('/',register);
app.use('/',profile);
app.use('/',tasks);
app.use('/',follow);
app.use('/',homepage);
app.use('/',search);
app.use('/',addTask);
app.use('/',upload);
app.use('/',fileHandle);
app.use('/',comments);
app.use('/',notifications);

var ip =  process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 1337;

app.listen(port,ip,function(){
  console.log("Server is listening on port",port);
})



