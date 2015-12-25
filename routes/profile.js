var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

function ensureAuthenticated(req,res,next)
{
	if(req.isAuthenticated()){
		next();
	}else{
		process.env.message = 'Please log in';
		res.redirect('/');
	}
}

router.get('/getUsers',function(req,res){
	mongoose.model('users').find(function(err,users){
	if(err) throw err;
	users.forEach(function(user){
		console.log('current users username',user.username);
			router.get('/' + user.username,function(req,res){
				if(req.isAuthenticated() && req.user[0].username == user.username){
					//render logged in page
					console.log('Loggedd in');
					res.render('profile',user);
				}else if(req.isAuthenticated() && req.user[0].username != user.username){
					//render just looking page
					console.log('Just looking');
					res.render('otherProfile',user);
				}else{
					res.send('Please log in <a href="/">here</a>');
				}
			});
		});
	});
	res.redirect('/');
});
mongoose.model('users').find(function(err,users){
	if(err) throw err;
	users.forEach(function(user){
		console.log('current users username',user.username);
		router.get('/' + user.username,function(req,res){
			if(req.isAuthenticated() && req.user[0].username == user.username){
				//render logged in page
				console.log('Loggedd in');
				res.render('profile',user);
			}else{
				//render just looking page
				console.log('Just looking');
				res.render('otherProfile',user);
			}
		});
	});
});

router.post('/getUserObject',function(req,res){
	console.log('I need to get this user',req.body.username);
	if(req.body.username == 'req'){
		req.body.username = req.user[0].username;
	}
	mongoose.model('users').findOne({username:req.body.username},function(err,user){
		res.send(user);
	});
});

module.exports = router;
