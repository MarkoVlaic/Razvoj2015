var express = require('express');
var router = express.Router();

//authentication middleware
var passport = require('passport');
var passportLocal = require('passport-local');

//database
var mongoose = require('mongoose');

passport.use(new passportLocal.Strategy(function(username,password,done){
	//TODO::Setup databse usage
	mongoose.model('users').find({username:username},function(err,user){
		if(err) throw err;
		console.log('length',user.length);
		if(user.length != 0){
			if(password === user[0].password){
				done(null,{id:user[0]._id,username:username});
			}else{
				done(null,null);
			}
		}else{
			done(null,null);
		}
	});
}));

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	//query database
	mongoose.model('users').find({_id:id},function(err,user){
		if(err) throw err;
		done(null,user);
	});
});

router.post('/login',function(req,res,next){
		console.log('my function is running');
		console.log('This username',req.body.username);
		process.env.message = 'Invali username or password';
		return next();
	},
	passport.authenticate('local',{ failureRedirect: '/', failureFlash: true }),function(req,res){
	if(req.isAuthenticated()){
		res.redirect('/'+req.body.username);
	}else{
		process.env.message = 'Invalid username or password';
		res.redirect('/');
	}
});

router.post('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

module.exports = router;