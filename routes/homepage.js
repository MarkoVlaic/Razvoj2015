var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

tasks = [];
var resPerLoad = 10;

router.get('/homepage',function(req,res){
	var d = generateHomepageData(req);
	// d.forEach(function(task){
	// 	tasks.push(task);
	// });
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
	// console.log('req users object',req.user[0]);
	mongoose.model('users').findOne({username:req.user[0].username},function(err,user){
		if(err) throw err;
		user.following.forEach(function(u){
			if(counter <= resPerLoad){

			}
		});
	});
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