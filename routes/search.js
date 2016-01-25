var express = require('express');
var router = express.Router()
var searchPlugin = require('mongoose-search-plugin')
var mongoose = require('mongoose');
var uSchema = mongoose.Schema(require('../Schemas/UserSchema'))
var toShow = [];
var title = '';
var User = mongoose.model('users');




router.post('/search',function(req,res){
	toShow=[]
	if(req.body.type == 'text'){
		toShow = []
	}
	
	console.log('body',req.body);
	/**
	mongoose.model('users').find(function(err,users){
		if(err) throw err;
		users.forEach(function(user){
			var contains = true;
			for(var i=0;i<req.body.search.length;i++){
				console.log(user.username[i]);
				if(i > user.username.length){
					break;
				}
				if(req.body.search[i] != user.username[i]){
					console.log('Not equal');
					contains = false;
					break;
				}
			}

			if(contains){
				toShow.push({type:user.type,name:user.username});
			}

		});
		//TODO:Finish same search results problem
		toShow.forEach(function(user){
			if(count(user,toShow) > 1){
				console.log("Counted more than one");
				toShow.splice(user,count(user,toShow) - 1);
			}
		});

		console.log('Showing',toShow);
		if(req.body.type == 'text'){
			res.send(toShow);
		}else{
			console.log('Else bato');
			res.send(null);
			
		}
		
	});
	**/
	//res.send("Hello world");
	/**
	mongoose.model('users').find({'username':'Marko'},(function(err,data){
		console.log(data,'DATA',data.length)
		for(i=0;i<data.length;i++){
			toShow.push({name:data[i].username,type:data[i].type})
		}
		console.log('TOSHOW',toShow)
		if (toShow.length!=0){
			console.log('AAAAA')
			res.send(toShow)
		}
		else{
			var toShow=[]
		}
		}));
	console.log(toShow)
	console.log('###############################################################################################################')
	**/
	title = req.body.search;
	console.log('TOSHOW',toShow,'full')
	toShow=[]
	console.log('TOSHOW',toShow,'shouldbeempty')
	mongoose.model('users').find('users',function(err,users){
		var u=100/title.length
		var p=0
		for (i=0;i<users.length;i++){
			p=0
			
			var t = title.length
			var m =users[i].username
			m=m.toLowerCase()
			console.log(m,'M')
			for (i2=0;i2<t;i2++){
				//*console.log(m[i2],title[i2])
				console.log(m[i2],title[i2],users[i].name)
				if(m[i2]==title[i2]){
					p=p+(u*((i2+1)/2))

				}
			}
			console.log(users[i].name,p,toShow)
			
            if(p != 0){
                toShow.push(
                 {name:users[i].username,type:users[i].type,perc:p
                });
            }	
			
		}
		toShow.sort(function(a, b) {
    		return parseFloat(b.perc) - parseFloat(a.perc);
    	
		});
		console.log(toShow)
		res.send(toShow)
		
})
	
	
});



router.get('/searchPage',function(req,res){
	console.log(toShow,2)
	console.log('HAHAHA')
	res.render('search',{
		toShow:toShow,
		title:title
	});



});




module.exports = router;