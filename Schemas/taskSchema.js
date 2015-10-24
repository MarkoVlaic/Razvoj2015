var mongoose = require('mongoose');

var taskSchema = {title:String,desc:String,author:String,comments:[],date:Date,likes:Number};
module.exports = taskSchema;