var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var fs = require('fs');

var multer = require('multer');
var upload = multer({dest:'uploads/'});

var Grid = require('gridfs-stream');
var gfs = null;

setTimeout(function(){
	gfs = Grid(mongoose.connection.db,mongoose.mongo);
},500);

//function ensureAuthenticated(req,res,next)
//{
//	if(req.isAuthenticated()){
//		next();
//	}else{
//		process.env.message = 'Please log in';
//		res.redirect('/');
//	}
//}
//
//router.get('/getUsers',function(req,res){
//	mongoose.model('users').find(function(err,users){
//	if(err) throw err;
//	users.forEach(function(user){
//		console.log('current users username',user.username);
//			router.get('/' + user.username,function(req,res){
//				if(req.isAuthenticated() && req.user[0].username == user.username){
//					//render logged in page
//					console.log('Loggedd in');
//					res.render('profile',user);
//				}else if(req.isAuthenticated() && req.user[0].username != user.username){
//					//render just looking page
//					console.log('Just looking');
//					res.render('otherProfile',user);
//				}else{
//					res.send('Please log in <a href="/">here</a>');
//				}
//			});
//		});
//	});
//	res.redirect('/');
//});
//mongoose.model('users').find(function(err,users){
//	if(err) throw err;
//	users.forEach(function(user){
//		console.log('current users username',user.username);
//		router.get('/' + user.username,function(req,res){
//			if(req.isAuthenticated() && req.user[0].username == user.username){
//				//render logged in page
//				console.log('Loggedd in');
//				res.render('profile',user);
//			}else{
//				//render just looking page
//				console.log('Just looking');
//				res.render('otherProfile',user);
//			}
//		});
//	});
//});

router.post('/getUserObject',function(req,res){
	console.log('I need to get this user',req.body.username);
	if(req.body.username == 'req'){
		req.body.username = req.user[0].username;
	}
	mongoose.model('users').findOne({username:req.body.username},function(err,user){
		res.send(user);
	});
});

router.get('/getProfilePic/:username',function(req,res){
    mongoose.model('users').findOne({username:req.params.username},function(err,user){
        if(err) throw err;
        console.log('users profile pic',user.profilePic);
        if(typeof(user.profilePic) == 'undefined'){
            console.log('profile pic undefined');
            res.send('images/noUser1.jpg');
        }else{
            var readStream = gfs.createReadStream({_id:user.profilePic});
            var buffer = '';
            readStream.on('data',function(chunk){
                buffer += chunk;
            });
            readStream.on('end',function(){
                console.log('This is the pic',buffer);
                res.send(buffer);
            });
        }
    });
});

router.post('/changeProfilePic',upload.array('profilePicInput',1),function(){
    mongoose.model('users').findOne({username:req.body.username},function(err,user){

        //remove existing profilePics
        var saveString = 'Username'-req.body.username + '-ProfilePic'
        var writeStream = gfs.createWriteStream({filename:saveString});
        user.profilePic = saveString;
        fs.createReadStream(req.files[0].path).on('end',function(){
            console.log('Read stream ended');
            var condition = {username:req.body.username};
            var update = {$set:{profilePic:user.profilePic}};
            mongoose.model('users').update(condition,update,{},function(err,userUpdated){
                if(err) throw err;
                console.log('User updated');
                res.sendStatus(200);
            });
        }).pipe(writeStream);

    });
    
});

module.exports = router;
