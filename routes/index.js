//framework
var express = require('express');
var router = express.Router();

//database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

router.get('/',function(req,res){
  if(!req.isAuthenticated()){
    res.render('newIndex',{
              title:'Razvoj softvera 2015',
              message:process.env.message,
              registerMessage:process.env.registerMessage
            });
      process.env.message = '';
      process.env.registerMessage = '';
  }else{
//    res.redirect('/'+req.user[0].username);
      res.render('homepage',{});
  }
  
});

router.get('/:username',function(req,res){
    if(!req.isAuthenticated()){
        res.redirect('/');
        process.env.message = 'Please log in to view the requested profile';
      }else if(req.params.username == 'homepage'){
        res.render('homepage');
      }else{
      mongoose.model('users').findOne({username:req.params.username},function(err,user){
      if(err) throw err;
      if(user == null){
        res.send('This webpage does not exist! Please check your search again.');
        
      }else if(user.type == 'Company'){
        res.render('CompanyProfile',user);
      }else if(req.user[0].type == 'Student'){
        res.render('StudentProfile',user);
      }else{
         res.send('Please log in <a href="/">here</a>');
      }
    });
  }
});

module.exports = router;