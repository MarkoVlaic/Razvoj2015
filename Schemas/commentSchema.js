var mongoose = require('mongoose');

var commentSchema = {author:String,content:String,date:Date,likedBy:[String]};
module.exports = commentSchema;