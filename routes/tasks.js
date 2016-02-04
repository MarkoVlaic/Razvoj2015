var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var taskSchema = require('../Schemas/taskSchema');
console.log('taskSchema',taskSchema);
var Task = mongoose.model('tasks',taskSchema);

router.post('/addTask',function(req,res){
	req.body.desc = req.body.desc.replace(/\r?\n/g, '<br />');
	var newTask = new Task({
		title:req.body.title,
		desc:req.body.desc,
        language:req.body.language,
		author:req.user[0].username,
		comments:[],
		likedBy:[],
		date:new Date()
	});

	req.user[0].usersTasks.push(newTask.author+'-'+newTask.title);

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
		res.redirect('/'+req.user[0].username);
	});

});

router.get('/getUsersTasks',function(req,res){
	mongoose.model('users').findOne({username:req.user[0].username},function(err,user){
		if(err) throw err;
		console.log('I sent this');
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

router.get('/removeTask/:title',function(req,res){
	// res.redirect('/');
	// console.log('I found',findTask(req.params.task,req.user[0].tasks));
	// res.send(findTask(req.params.task,req.user[0].usersTasks));
	var curTask = null;
	req.user[0].usersTasks.forEach(function(t){
		if(t.title == req.params.title){
			curTask = t;
			return;
		}
	});
	req.user[0].usersTasks.splice(req.user[0].usersTasks.indexOf(curTask),1);
	var condition = {username:req.user[0].username};
	var update = {$set:{usersTasks:req.user[0].usersTasks}};
	var options = {multi:false};

	mongoose.model('users').update(condition,update,options,function(err,numUpdated){
		if(err) throw err;
		console.log('Tasks updated');
        mongoose.model('tasks').remove({title:req.params.title},function(err,taskRemoved){
            if(err) throw err;
            res.redirect('/'+req.user[0].username);
        });
	});
});


router.get('/loadTask/:id',function(req,res){
    console.log('Gonna load the task');
	var id = req.params.id.split('-');
	console.log('author',id[0],'Title',id[1]);
	mongoose.model('tasks').findOne({author:id[0],title:id[1]},function(err,task){
		if(err) throw err;
		res.send(task);
	});
});


router.get('/likeTask/:id',function(req,res){
    console.log('Gonna like it');
	var id = req.params.id.split('-');
	console.log('This is id',id);
	mongoose.model('tasks').findOne({author:id[0],title:id[1]},function(err,task){
		if(err) throw err;
		
		if(task.likedBy.indexOf(id[2]) != -1){
			task.likedBy.splice(task.likedBy.indexOf(id[2]));
            var toRemove = {type:'like',sender:req.user[0].username,reciever:id[0]};
            mongoose.model('users').findOne({username:id[0]},function(err,user){
                    if(err) throw err;
                        mongoose.model('notifications').find(toRemove,function(err,notif){
                        if(err) throw err;
                        user.notifications.splice(user.notifications.indexOf(notif._id),1);

    var condition = {username:user.username};         
    var update = {notifications:user.notifications};
    
    mongoose.model('users').update(condition,update,{},function(err,userUpdated){
        if(err) throw err;
                mongoose.model('notifications').remove(toRemove,function(err,removed){
                        if(err) throw err;
                        console.log('Notification removed');
                });
            });               
        });
    });
            
		}else{
			task.likedBy.push(id[2]);
		}

		var condition = {author:id[0],title:id[1]};
		var update = {$set:{likedBy:task.likedBy}}
		mongoose.model('tasks').update(condition,update,function(err,taskUpdated){
			if(err) throw err;
			res.send(task.likedBy.length.toString());
		});

	});
});

module.exports = router;