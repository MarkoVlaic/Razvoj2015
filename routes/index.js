//framework
var express = require('express');
var router = express.Router();

//database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//file handling
var path = require('path');

router.get('/',function(req, res) {
    //if user is logged in show his profile otherwise
    //send him to login page
      mongoose.model('users').find(function(err,users){
      if(err) throw err;
      users.forEach(function(user){
        console.log('current users username',user.username);
          router.get('/' + user.username,function(req,res){
            mongoose.model('users').find({username:user.username},function(err,usr){
              if(err) throw err;
              usr[0].userType = req.user[0].type;
              if(req.isAuthenticated() && req.user[0].username == user.username){
                //render logged in page
                console.log('Loggedd in');
                console.log('User type',req.user[0].type);
                res.render(req.user[0].type + 'Profile',usr[0]);
              }else if(req.isAuthenticated() && req.user[0].username != user.username){
                //render just looking page
                console.log('Just looking user followers',req.user[0].username,usr[0].followers,'username','boolean',(req.user[0].username in usr[0].followers));
                if(usr[0].followers.indexOf(req.user[0].username) >= 0){
                  console.log('Followed');
                  usr[0].followed = true;
                }else{
                  console.log('Not followed');
                  usr[0].followed = false;
                }
                for (var i = 0; i < usr[0].usersTasks.length; i++) {
                  if(req.user[0].liked.indexOf(usr[0].usersTasks[i]) >= 0){
                    console.log('LIKED');
                    usr[0].usersTasks[i].liked = true;
                  }else{
                    console.log('NO LIKED');
                    usr[0].usersTasks[i].liked = false;
                  }
                }

                usr[0]['loggedInUser'] = req.user[0].username;
                console.log('Just looking user object',usr[0]);
                res.render('otherProfile',usr[0]);
              }else{
                res.send('Please log in <a href="/">here</a>');
              }
            }); 
          });
    });
    if(!req.isAuthenticated()){
   		res.render('newIndex',{
        title:'Razvoj softvera 2015',
        message:process.env.message,
        registerMessage:process.env.registerMessage
      });
      process.env.message = '';
      process.env.registerMessage = '';
    }else{
      res.redirect('/'+req.user[0].username);
    }
});
}); 

module.exports = router;