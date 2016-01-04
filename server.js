var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var fs = require('fs');

var passport = require('passport');

//routes
var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var profile = require('./routes/profile');
var tasks = require('./routes/tasks');
var follow = require('./routes/follow');
var homepage = require('./routes/homepage');
// var like = require('./routes/like');
var search = require('./routes/search');
var addTask = require('./routes/addTask');
var upload = require('./routes/upload');
var fileHandle = require('./routes/fileHandle');

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
dev = true;
if(!dev){
	console.log('Not in dev');
	var conn = mongoose.connect('mongodb://osak:MaPa2015!@ds059722.mongolab.com:59722/osak',function(){
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
// app.use('/',like);
app.use('/',search);
app.use('/',addTask);
app.use('/',upload);
app.use('/',fileHandle);

var ip =  process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 1337;

app.listen(port,ip,function(){
  console.log("Server is listening on port",port);
})



