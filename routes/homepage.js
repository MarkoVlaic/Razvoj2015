var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var userSchema = require('../Schemas/UserSchema');

var async = require('async');

tasks = [];
var resPerLoad = 10;


//router.get('/homepage',function(req,res){
//  // var d = generateHomepageData(req);
//  // d.forEach(function(task){
//  //  tasks.push(task);
//  // });
////    res.render('homepage',{});
//});


//Route za vuci podatke
router.post('/loadHomepageData',function(req,res){
    //var d = generateHomepageData(req.body.news,req.user[0].username);
    var d = null;
    var done = true;
    generateHomepageData([],req.user[0].username,function(data){
        console.log("Funkcija")
        //Posalji generirane podatke
        d = data;
        data.reverse()
        console.log("DATA!!!!!!!!!!!",data);
        if(done){
            res.send(d)
            done = false;
        } 
    

    });
    
    
    
}); 

var counter = 0;
//Ovo ti treba dolje
var dayOffset = 1;

function generateHomepageData(news,username,callback)
{
    var sendData = [];
    //Kolekcije koje algoritam pretrazuje iz user objekta
    var toSearch = ['following','followers'];
    
    var i = -1;
    var z = -1;
    var j = -1;
    mongoose.model('users').findOne({username:username},function(err,user){
        i++
        

        if(err) throw err;
        //Porlazi kroz sve sto je potrebno provjeriti
        toSearch.forEach(function(property,index1,array1){
            //Uzmi svakog usera iz te kolekcije
            user[property].forEach(function(data,index2,array2){
                j++;
                mongoose.model('users').findOne({username:data},function(err,dataUser){
                    if(err) throw err;
                    
                        //Ako taj user postoji(dodano samo zbog sigurnosti to se ne bi trebalo dogadati)
//prodi kroz sve zadatke                     
                        
                        dataUser.usersTasks.forEach(function(task,index3){
                            //TODO: U ovaj if staviti uvjete vezane uz vremensku razliku
                             z++;
                            if(news.indexOf(task) == -1 && sendData.indexOf(task) == -1 && sendData.length<10 && !(task in user.liked) && !(task in user.solved)){
                                console.log(task)
                                sendData.push(task);

                            }
                            console.log("I J Z",index1,index2,index3)
                            if(index2 == user[property].length-1 && index3 == dataUser.usersTasks.length -1){
                                callback(sendData)
                        
                            }


                        }



                        );
                    
                    
                    //Ovo je kraj obje petlje
                    
                    z=-1;
                });
                

                console.log('J',j);
            });
            j=-1;
        });
        
        
        
    });
}

//Funkcija koja vraca razliku u danima izmedu dva datuma
function calculateDayOffset(date)
{
    var dayFormula = 1000*60*60*24;
    return Math.round(new Date().getTime()/dayFormula - date.getTime()/dayFormula);
}


module.exports = router;