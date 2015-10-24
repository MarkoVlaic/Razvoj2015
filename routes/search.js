var express = require('express');
var router = express.Router()

var mongoose = require('mongoose');

var toShow = [];
var title = '';

router.get('/search',function(req,res){
	if(req.query.type == 'text'){
		toShow = [];
	}
	title = req.query.search;
	console.log('Query',req.query);
	mongoose.model('users').find(function(err,users){
		if(err) throw err;
		users.forEach(function(user){
			var contains = true;
			for(var i=0;i<req.query.search.length;i++){
				console.log(user.username[i]);
				if(i > user.username.length){
					break;
				}
				if(req.query.search[i] != user.username[i]){
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
		if(req.query.type == 'text'){
			res.send(toShow);
		}else{
			console.log('Else bato');
			res.send(null);
			
		}
		
	});
	//res.send("Hello world");
});

router.get('/searchPage',function(req,res){
	res.render('search',{
		toShow:toShow,
		title:title
	});
});

function count(item,a)
{
	var res = 0;
	a.forEach(function(i){
		if(i == item){
			res++;
		}
	});
	return res;
}

module.exports = router;