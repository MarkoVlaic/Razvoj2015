var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var userSchema = require('../Schemas/UserSchema');
var User = mongoose.model('users');

router.post('/follow',function(req,res){
	console.log('following',req.user[0].following,'username',
		req.body.username,
		'boolean',req.user[0].following.indexOf(req.body.username < 0));
	if(req.user[0].following.indexOf(req.body.username.replace(' ','')) < 0){
		console.log('Follow the user');
		req.user[0].following.push(req.body.username);
	}else{
		console.log('Unfollow the user');
		req.user[0].following.splice(req.body.username,1);
	}

	var condition = {username:req.user[0].username};
	var update = {$set:{following:req.user[0].following}};
	var options = {multi:false};

	mongoose.model('users').update(condition,update,options,function(err,numUpdated){
		if(err) throw err;
		console.log('Following user updated');
	});

	console.log('req.body',req.body);

	mongoose.model('users').find({username:req.body.username},function(err,user){
		if(err) throw err;
		//HEREEEEE
		console.log('username',user[0].username);
		if(req.user[0].following.indexOf(req.body.username.replace(' ','')) < 0){
			console.log('Gonna push it');
			user[0].followers.splice(req.user[0].username,1);
		}else{
			console.log('Gonna pop item');
			user[0].followers.push(req.user[0].username);
		}

		var condition = {username:req.body.username};
		var update = {$set:{followers:user[0].followers}}
		var options = {multi:false};

		mongoose.model('users').update(condition,update,options,function(err,numUpdated){
			if(err) throw err;
			console.log('Followed user updated');
		});
	});
	//res.redirect('/'+req.body.username);
	res.send('Done');
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
            return;
		}
	});

	return found;
}

module.exports = router;