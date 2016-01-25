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
//	res.render('homepage',{});
});

router.post('/loadHomepageData',function(req,res){
	// d = generateHomepageData(req.body.news,req.user[0].username);
	var d = null;
	generateHomepageData([],req.user[0].username,function(data){
		console.log('Data',data);
		d = data;
		data.reverse()
		res.send(data);
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
	var sendData = [];
	var maxDayOffset = 10;
	
	var toSearch = ['following','followers'];
    
    
    mongoose.model('users').findOne({username:username},function(err,user){
        if(err) throw err;
        toSearch.forEach(function(property,index1){
            console.log('This is property',property,'and data',user[property]);
            user[property].forEach(function(data,index2){
                console.log('ringispil',data);
                mongoose.model('users').findOne({username:data},function(err,dataUser){
                    if(err) throw err;
                    console.log('dataUser',dataUser);
                    if(dataUser != null && typeof(dataUser) != 'undefined'){
                        sendData.push(dataUser);
                    }
                    if(index1 == toSearch.length - 1 && index2 == user[property].length - 1){ 
                        console.log('data Im sending',sendData);
                        callback(sendData);
                    }
                });
            });
        });
    }).then(function(){
        console.error('Mongoose query end');
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