var taskSchema = require('./taskSchema');
var commentSchema = require('./commentSchema');

var userSchema = {username:String,name:String,lastname:String
	,password:String,likes:Number,favourites:[taskSchema],
	birthDay:Number,birthMonth:Number,birthYear:Number,
	usersTasks:[taskSchema],tasksToSolve:[taskSchema],solved:[String],comments:[commentSchema],
	following:[String],followers:[String],liked:[String],type:String
};

module.exports = userSchema;