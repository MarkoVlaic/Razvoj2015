var mongoose = require('mongoose');
var userSchema = require('./Schemas/UserSchema');

mongoose.connect('mongodb://127.0.0.1/projektDb',function(){
  console.log("database connected");
});

var User = mongoose.model('users',userSchema);

function createTest(n)
{
	for (var i = 0; i < n; i++) {
		var user = new User({
			username:i,name:i,lastaname:i,
			password:"123",likes:0,school:"Osak",teacher:"",
			birthDay:1,birthMonth:1,birthYear:2000,
			followers:[],following:[],comments:[],
			tasks:[],favourites:[]
		});

		user.save(function(err,userSaved){
			if(err) throw err;
			console.log('User #',i,'saved');
		});
	};
}

console.log('Speed test started');
createTest(1000);