var fs = require('fs');

var mongoose = require('mongoose');

var Grid = require('gridfs-stream');
var GridFs = Grid(mongoose.connection.db,mongoose.mongo);

module.exports = function putFile(path,name,callback){
	var writeStream = GridFs.createWriteStream({
		filename:name
	});
	writeStream.on('close',function(file){
		callback(null,file);
	});
	fs.createReadStream(path).pipe(writeStream);
};