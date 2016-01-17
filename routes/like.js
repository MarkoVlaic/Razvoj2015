var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

router.get('/like',function(req,res){
	mongoose.model('usersTasks').find({title:req.query.title,author:req.query.author},function(err,task){
		if(task[0].liked){
			task[0].liked = false;
			task[0].likes -= 1;
			req.user[0].liked.splice(task[0].title);
		}else{
			task[0].liked = true;
			task[0].likes += 1;
			req.user[0].liked.push(task[0].title);
		}
		var condition = {username:req.user[0].username};
		var action = {$set:{liked:req.user[0].liked}};
		mongoose.model('users').update(condition,action,function(err){
			if(err) throw err;
			console.log('Like user updated');
		});

		mongoose.model('users').find({username:req.query.author},function(err,user){
			for (var i = 0; i < user[0].usersTasks.length; i++) {
				if(user[0].usersTasks[i] == req.query.title){
					user[0].usersTasks[i].likes = task[0].likes;
					break;
				}
			}

			mongoose.model('users').update({username:user[0].username},{usersTasks:user[0].usersTasks},function(err){
				if(err) throw err;
				console.log('One more updated');
			});

		});

		var condition = {title:req.query.title,author:req.query.author};
		var action = {$set:{liked:task[0].liked,likes:task[0].likes}};

		mongoose.model('usersTasks').update(condition,action,function(err){
			if(err) throw err;
			console.log('Like task updated');
		});

		if(task[0].liked){
			res.send('Dislike');
		}else{
			res.send('Like');
		}
	});
});

module.exports = router;