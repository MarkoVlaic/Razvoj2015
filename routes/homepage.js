var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var userSchema = require('../Schemas/UserSchema');

var async = require('async');

tasks = [];
var resPerLoad = 10;


//router.get('/homepage',function(req,res){
//	// var d = generateHomepageData(req);
//	// d.forEach(function(task){
//	// 	tasks.push(task);
//	// });
////	res.render('homepage',{});
//});


//Route za vuci podatke
router.post('/loadHomepageData',function(req,res){
	// d = generateHomepageData(req.body.news,req.user[0].username);
	var d = null;
	generateHomepageData([],req.user[0].username,function(data){
		console.log('Data',data);
        //Posalji generirane podatke
		d = data;
		data.reverse()
		res.send(data);
	});	

	// process.nextTick(function(){
	// 	if(d == null){
	// 		process.nextTick(arguments.callee);
	// 	}else{
	// 		res.send(d);
	// 	}
	// });
});	

var counter = 0;
//Ovo ti treba dolje
var dayOffset = 1;

function generateHomepageData(news,username,callback)
{
	var sendData = [];
	//Kolekcije koje algoritam pretrazuje iz user objekta
	var toSearch = ['following','followers'];
    
    
    mongoose.model('users').findOne({username:username},function(err,user){
        if(err) throw err;
        //Porlazi kroz sve sto je potrebno provjeriti
        toSearch.forEach(function(property,index1){
            console.log('This is property',property,'and data',user[property]);
            //Uzmi svakog usera iz te kolekcije
            user[property].forEach(function(data,index2){
                console.log('ringispil',data);
                mongoose.model('users').findOne({username:data},function(err,dataUser){
                    if(err) throw err;
                    console.log('dataUser',dataUser);
                    if(dataUser != null && typeof(dataUser) != 'undefined'){
                        //Ako taj user postoji(dodano samo zbog sigurnosti to se ne bi trebalo dogadati)
//prodi kroz sve zadatke                       
                        dataUser.usersTasks.forEach(function(task){
                            //TODO: U ovaj if staviti uvjete vezane uz vremensku razliku
                            if(news.indexOf(task) == -1 && sendData.indexOf(task) == -1){
                                sendData.push(task);
                            }
                        });
                    }
                    //Ovo je kraj obje petlje
                    if(index1 == toSearch.length - 1 && index2 == user[property].length - 1){ 
                        console.log('data Im sending',sendData);
                        //TODO: Prvo provjeriti je li sendData.length manji od 10 i ako je napuniti ga sa random zadatcima
                        //Salje sendData dalje
                        callback(sendData);
                    }
                });
            });
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