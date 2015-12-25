var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var gfs = null;

setTimeout(function(){
	gfs = Grid(mongoose.connection.db,mongoose.mongo);
},500);

router.post('/preview',function(req,res){
	console.log('req.body',req.body);
	console.log('req.query',req.query);
	console.log('req.params',req.params);

	var readStream = gfs.createReadStream({filename:req.query.name});
	var buffer = '';
	readStream.on('data',function(chunk){
		console.log('chunk',chunk);
		buffer += chunk;
	});

	readStream.on('end',function(){
		console.log('Ive read:',buffer);
		res.send(buffer);
	});
});


router.post('/download',function(req,res){
	var readStream = gfs.createReadStream({filename:req.query.name})
	// res.download(readStream);
	console.log('Download called');
	res.download('images/picture.png','picture',function(err){
		if(err) throw err;
		console.log('download complete');
	});
});

module.exports = router;