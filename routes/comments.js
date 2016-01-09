var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var commentSchema = require('../Schemas/commentSchema');
var Comment = mongoose.model('comments',commentSchema);

router.get('/loadComment/:id',function(req,res){
    console.log('Loading a comment here');
                                                                            mongoose.model('comments').findOne({_id:mongoose.Types.ObjectId(req.params.id)},      function(err,comment){
    if(err) throw err;
    console.log('Comment i get',comment);
    res.send(comment);
}); 
    
});

router.post('/commentTask',function(req,res){
    var newComment = new Comment({
        author:req.body.author,
        content:req.body.content,
        date:new Date(),
        likedBy:[],
    });
   
    console.log('new Comment',newComment);
    
    newComment.save(function(err,commentSaved){
        if(err){throw err}
        console.log('Comment appended');
        var taskId = req.body.taskId.split('-');
        console.log('Task id',taskId);
        mongoose.model('tasks').findOne({author:taskId[0],title:taskId[1]},function(err,task){
            console.log('task',task);
            console.log('task comments',task.comments);
            task.comments[task.comments.length] = newComment._id;
            console.log('New comments',task.comments);
            var condition = {author:taskId[0],title:taskId[1]};
            var update = {$set:{comments:task.comments}};
            mongoose.model('tasks').update(condition,update,{multi:false},function(err,updated){
                if(err) throw err;
                res.send('Comment done');
            });
        });
    });
    
});

router.post('/removeComment',function(req,res){
    var taskId = req.body.taskId.split('-');
    mongoose.model('tasks').findOne({author:taskId[0],title:taskId[1]},function(err,task){
        task.comments.splice(task.comments.indexOf(req.body.commentId),1);
    var condition = {author:taskId[0],title:taskId[1]};
    var update = {$set:{comments:task.comments}};
    mongoose.model('tasks').update(condition,update,{},function(err,taskUpdated){
        if(err) throw err;
        mongoose.model('comments').remove({_id:mongoose.Types.ObjectId(req.body.commentId)},function(err,removed){
            if(err) throw err;
            console.log('Comment removed everythings fine');
            res.send('Done');
        });
    });
    });
});

module.exports = router;