var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

router.post('/addTaskToSolve',function(req,res){
	// console.log('Req object in adding',req);
	// console.log('Author',req.body.username,'Task'.req.body.task);
	mongoose.model('tasks').find({author:req.body.username,title:req.body.task},
		function(err,task){
			if(err) throw err;
			console.log('task we get iiiis',task);
			console.log("Tasks before alligment",req.user[0].tasksToSolve);
			// console.log('req.user',req.user);

			var authors = createArray(req.user[0].tasksToSolve,'author');
			var titles = createArray(req.user[0].tasksToSolve,'title');

			console.log('authors',authors);
			console.log('titles',titles);

			console.log('Author in',task[0].author in authors);
			console.log('Title in',task[0].title in titles);

			if(authors.indexOf(task[0].author) > -1 && titles.indexOf(task[0].title) > -1){
				console.log("I am gonna splice this madafaka");
				req.user[0].tasksToSolve.splice(req.user[0].tasksToSolve.indexOf(task[0]),1);				
			}else{
				console.log("Not in tasks to solve");
				req.user[0].tasksToSolve.push(task[0]);
			}
			

			var condition = {username:req.user[0].username};
			var update = {$set:{tasksToSolve:req.user[0].tasksToSolve}};
			var options = {multi:false};
			mongoose.model('users').update(condition,update,options,function(err,updated){
				if(err) throw err;
				console.log('User updated');
			});

		});
	res.send("You tried to add me to list but you failed madafaka");
});

function createArray(a,key)
{	
	var res = [];
	a.forEach(function(item){
		res.push(item[key]);
	});
	return res;
}

module.exports = router;