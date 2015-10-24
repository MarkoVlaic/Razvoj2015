var express = require('express');
var router = express.Router();

var fs = require('fs');

var multer = require('multer');
var upload = multer({dest:'uploads/'});

var mongoose = require('mongoose');

var Grid = require('gridfs-stream');
var gfs = null;

setTimeout(function(){
	gfs = Grid(mongoose.connection.db,mongoose.mongo);
},500);


// var FileHandle = require('../Utils/FileHandle');

var limit = 10;

// console.log("This is something I get",mongoose.connection.db);

// FileHandle.putFile('C:\\Users\\ASUS\\Desktop\\',"practice.txt");

router.post('/uploadTask',upload.array('fileUpload',limit),function(req,res){
	console.log('Req.body',req.body);
	console.log('Req.files',req.files);

	req.files.forEach(function(file){
		// fs.unlink(file.path,function(err){
			// if(err) throw err;
		var saveString = 'Title-' + req.body.info.split(' ')[0] + '-Filename-' + file.originalname + '-User-' + req.user[0].username;
		var writeStream = gfs.createWriteStream({filename:saveString});
		fs.createReadStream(file.path).on('end',function(){
			// Handle list of tasks to solve
			console.log('Before',req.user[0].tasksToSolve);
			req.user[0].tasksToSolve = removeObjectFromList(req.user[0].tasksToSolve,['title','author'],[req.body.info.split(' ')[0],req.body.info.split(' ')[1]]);
			req.user[0].solved.push(saveString);
			console.log('After',req.user[0].tasksToSolve);
			
			var condition = {username:req.user[0].username};
			//update solutions in user
			var update = {$set:{tasksToSolve:req.user[0].tasksToSolve,solved:req.user[0].solved}};
			var options = {multi:false};

			mongoose.model('users').update(condition,update,options,function(err,updated){
				if(err) throw err;
				console.log('Updated');
				res.redirect('/');
			});
			// res.send('Done');
		}).on('error',function(){
			res.send('error');
		}).pipe(writeStream);
		// });
	});
});

function removeObjectFromList(list,fields,conditions)
{
	res = [];
	list.forEach(function(item){
		var found = 0;
		for(var i=0;i<fields.length;i++){
			if(item[fields[i]] == conditions[i]){
				found++;
			}
		}
		if(found != fields.length){
			res.push(item);
		}
	});
	return res;
}

module.exports = router;