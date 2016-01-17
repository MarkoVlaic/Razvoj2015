var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var path = require('path');

var userSchema = require('../Schemas/UserSchema');
var User = mongoose.model('users',userSchema);

router.post('/register',function(req,res){
	//check if username is in use
	mongoose.model('users').find(function(err,users){
		if(err) throw err;
		var usernames = [];
		users.forEach(function(user){
			console.log('user',user);
			usernames.push(user.username);
		});
		
		if(isInList(req.body.username,usernames)){
			console.log('Username doesn\'t exist');
			process.env.registerMessage = 'Username already exists';
			res.redirect('/');
			return false;
		}

		if(req.body.password != req.body.repeat_password){
			process.env.registerMessage = 'Passwords don\'t match';
			res.redirect('/');
			return false;
		}
		console.log('register type',req.body.userType);
		//TODO: Add email functionality
		var newUser = new User({
			username:req.body.username,
			password:req.body.password,
			name:req.body.firstname,
			lastname:req.body.lastname,
			tasksToSolve:[],
			usersTasks:[],
			solved:[],
			likes:0,
			birthDay:req.body.day,
			birthMonth:req.body.month,
			birthYear:req.body.year,
			type:req.body.userType,
			following:[],
			followers:[],
			liked:[],
			employees:[],
            profilePic:undefined
			});
		
		newUser.save(function(err,userSaved){
			if(err) throw err;
			console.log('User saved');
			res.redirect('/');
		});

	});
});

function isInList(item,list)
{
	console.log('item',item)
	var found = false;
	list.forEach(function(l){
		console.log('l',l);
		if(item === l){
			console.log('found an item');
			found = true;
		}
	});

	return found;
}

module.exports = router;