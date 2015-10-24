var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var taskSchema = require('../Schemas/taskSchema');
console.log('taskSchema',taskSchema);
var Task = mongoose.model('tasks',taskSchema);

router.post('/addTask',function(req,res){
	var newTask = new Task({
		title:req.body.title,
		desc:req.body.desc,
		author:req.user[0].username,
		comments:[],
		likes:0,
		date:new Date()
	});

	req.user[0].usersTasks.push(newTask);

	var condition = {username:req.user[0].username};
	var update = {$set:{usersTasks:req.user[0].usersTasks}};
	var options = {multi:false};

	mongoose.model('users').update(condition,update,options,function(err,numUpdated){
		if(err) throw err;
		console.log('User updated');
	});

	newTask.save(function(err,taskSaved){
		if(err) throw err;
		console.log('Task saved');	
		//res.redirect('/getUsers');
		res.redirect('/');
	});

});

router.get('/getUsersTasks',function(req,res){
	mongoose.model('users').findOne({username:req.user[0].username},function(err,user){
		if(err) throw err;
		res.send(user.usersTasks);
	});
});

router.get('/getTasksToSolve',function(req,res){
	mongoose.model('users').findOne({username:req.user[0].username},function(err,user){
		if(err) throw err;
		console.log('I got this user',user);
		console.log('I got these tasks',user.tasksToSolve);
		res.send(user.tasksToSolve);
	});
});

router.get('/getSolutions',function(req,res){
	mongoose.model('users').findOne({username:req.user[0].username},function(err,user){
		if(err) throw err;
		res.send(user.solved);
	});
});

module.exports = router;