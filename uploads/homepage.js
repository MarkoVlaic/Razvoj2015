var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

tasks = [];
var resPerPage = 10;

router.get('/homepage',function(req,res){
	var d = generateHomepageData(req);
	d.forEach(function(task){
		tasks.push(task);
	});
	res.render('homepage',{
		tasks:tasks
	});
});

function generateHomepageData(req)
{
	var data = [];
	var counter = 0;
	//var monthOffset = 0;
	var dayOffset = 1;
	var dayFormula = 24 * 60 * 60 * 1000;
	mongoose.model('users').find({username:req.user[0].username},function(err,user){
		if(err) throw err;
		//console.log('current user');
		var names = generateUsernameArray(tasks);
		console.log('These are the names',names);
		while(counter < resPerPage){
			console.log('This are people user is following',user[0].following);
			user[0].following.forEach(function(username){
				console.log('Username',username,'in names',username in names);
				if(!(username in names)){
					console.log('I am not in names doo something');
					mongoose.model('users').find({username:username},function(err,usr){
						console.log('User object tasks with username',username,usr);
						usr[0].tasks.forEach(function(task){
								var curDate = new Date();
								var diff = Math.round(curDate.getTime()/dayFormula - task.date.getTime()/dayFormula);
								// console.log('task',task.title,'date',task.date,'difference',diff);
								if(diff <= dayOffset){
									tasks.push(task);
								}
							});
						});
					}
				});

				//if nothing up worked out put the end here
				dayOffset++;
				if(dayOffset > 31){
					break;
				}
			}
		});

	return data;
}

function generateUsernameArray(object)
{
	var array = [];
	object.forEach(function(item){
		array.push(item.username);
	});

	return array;
}

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

function setResPerPage(i)
{
	resPerPage = i;
}

module.exports = router;