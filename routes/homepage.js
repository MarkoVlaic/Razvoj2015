var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var userSchema = require('../Schemas/UserSchema');

var async = require('async');

tasks = [];
var resPerLoad = 10;

Array.cleanSame = function(a){
	res = [];
	a.forEach(function(i){
		if(res.indexOf(i) == -1){
			res[res.length] = i;
		}
	});

	return res;
}

Array.isTaskInList = function(task,array){
	var res = false;
	array.forEach(function(i){
		if(task.title == i.title){
			res = true;
			return
		}
	});
	return res;
}

router.get('/homepage',function(req,res){
	// var d = generateHomepageData(req);
	// d.forEach(function(task){
	// 	tasks.push(task);
	// });
	res.render('homepage',{});
});

router.get('/loadHomepageData',function(req,res){
	// d = generateHomepageData(req.body.news,req.user[0].username);
	var d = null;
	generateHomepageData([],req.user[0].username,function(data){
		console.log('Data',data);
		d = data;
		data.reverse()
		res.send(Array.cleanSame(data));
	});	

	// process.nextTick(function(){
	// 	if(d == null){
	// 		process.nextTick(arguments.callee);
	// 	}else{
	// 		res.send(d);
	// 	}
	// });
});	

var counter = 0;
//var monthOffset = 0;
var dayOffset = 1;


function generateHomepageData(news,username,callback)
{
	var data = [];
	var maxDayOffset = 10;
	
	var toSearch = ['following','followers'];
	console.log('Neeeews',news);
	var callbacked = false;
	var calls = [];
	// mongoose.model('users').findOne({username:username},function(err,user){
	// 	if(err) throw err;
	// 	process.nextTick(function(){
	// 		toSearch.forEach(function(item){
	// 			if(callbacked){
	// 				return
	// 			}
	// 			user[item].forEach(function(u){
	// 				mongoose.model('users').findOne({username:u},function(err,usr){
	// 					// console.log('User I geett',usr);
	// 					if(callbacked){
	// 						return
	// 					}
	// 					usr.usersTasks.forEach(function(task,index,array){
	// 						console.log('Task iis',task.title);
	// 						console.log('my condition',(news.indexOf(task) < 0 && !Array.isTaskInList(task,data) && calculateDayOffset(task.date) <= dayOffset && counter < resPerLoad));
	// 						// console.log('data',data,'data index',!Array.isTaskInList(task,data));
	// 						if(news.indexOf(task) < 0 && !Array.isTaskInList(task,data) && calculateDayOffset(task.date) <= dayOffset && counter < resPerLoad){
	// 							data[data.length] = task;
	// 						}
	// 						if(dayOffset > maxDayOffset || data.length > resPerLoad && callbacked == false && index==array.length-1){
	// 							console.log('Calling a callback');
	// 							console.log('day offset',dayOffset);
	// 							console.log('Callbacked',callbacked);
	// 							console.log('index',index,'array.length',array.length);
	// 							if(callbacked == false){	
	// 								if(index == array.length-1){
	// 									callback(data);
	// 									callbacked = true;
	// 									return
	// 								}
	// 							}
								
	// 							// process.exit();
	// 						}
	// 					});
	// 				});
	// 			});
	// 		});
	// 		dayOffset++;
	// 		if(dayOffset < maxDayOffset && data.length < resPerLoad && !callbacked){
	// 			process.nextTick(arguments.callee);
	// 		}

	// 	}); //while loop end 

	
	var toCall = [];
	
	mongoose.model('users').findOne({username:username},function(err,user){
		toSearch.forEach(function(item){
				user[item].forEach(function(u){
					mongoose.model('users').findOne({username:u},function(err,usr){
						// console.log('User I geett',usr);
						usr.usersTasks.forEach(function(task,index,array){
							console.log('Should push',toCall);
							toCall.push(function(cb){
								console.log('Task iis',task.title);
								console.log('my condition',(news.indexOf(task) < 0 && !Array.isTaskInList(task,data) && calculateDayOffset(task.date) <= dayOffset && counter < resPerLoad));
								// console.log('data',data,'data index',!Array.isTaskInList(task,data));
								if(news.indexOf(task) < 0 && !Array.isTaskInList(task,data) && calculateDayOffset(task.date) <= dayOffset && counter < resPerLoad){
									data[data.length] = task;
								}
								if(dayOffset > maxDayOffset || data.length > resPerLoad && index==array.length-1){
									console.log('Calling a callback');
									console.log('day offset',dayOffset);
									console.log('Callbacked',callbacked);
									console.log('index',index,'array.length',array.length);
									// callback(data);
									// cb('Err',data);
									// process.exit();
								}
								cb(null,data);
							});
						});
						dayOffset++;
					});
				});
			});
	}); //mongoose query end

	async.series(toCall,function(err,result){
		if(err){throw err}
		console.log('To call',toCall);
		callback(data);
	});
}

function calculateDayOffset(date)
{
	var dayFormula = 1000*60*60*24;
	return Math.round(new Date().getTime()/dayFormula - date.getTime()/dayFormula);
}

function generateUsernameArray(object)
{
	var array = [];
	object.forEach(function(item){
		array.push(item.username);
	});
cd
	return array;
}


function setResPerPage(i)
{
	resPerPage = i;
}

module.exports = router;