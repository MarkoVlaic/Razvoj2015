var mongoose = require('mongoose');

var taskSchema = {title:String,desc:String,author:String,comments:[String],date:Date,likedBy:[String],language:String,solvedBy:[String]};
module.exports = taskSchema;
