var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var notificationSchema = require('../Schemas/notificationSchema.js');
var Notification = mongoose.model('notifications',notificationSchema);

router.post('/addNotification',function(req,res){
    console.log("sender",req.body.sender,'user',req.user[0].username);
    if(req.body.reciever != req.user[0].username){
        console.log("notifiy");
        var notification = new Notification({
            type:req.body.type,
            content:req.body.content,
            sender:req.body.sender,
            reciever:req.body.reciever,
            object:req.body.object
        });
        notification.save(function(err,notificationSaved){
            if(err) throw err;
            console.log('Saved');
            mongoose.model('users').findOne({username:req.body.reciever},function(err,user){
                if(err) throw err;
                user.notifications.push(notification._id);
                var condition = {username:req.body.reciever};
                var update = {notifications:user.notifications};
                mongoose.model('users').update(condition,update,{},function(err,userSaved){
                    if(err) throw err;
                    console.log('User is saved');
                    res.sendStatus(200);
                });
            });
        });
    }
});

router.get('/loadNotification/:id',function(req,res){
    mongoose.model('notifications').findOne({_id:req.params.id},function(err,notification){
        res.send(notification)
    });
});

module.exports = router;