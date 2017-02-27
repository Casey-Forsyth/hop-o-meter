// app/batches.js


var db            = require('../db/db.js');
var isLoggedIn = require('./isLoggedIn');


module.exports = function(app, passport) {

    app.get('/setup', isLoggedIn, function(req, res) {

        var start = parseInt(req.params.start);
        var end = parseInt(req.params.end);
        var kegNumber = parseInt(req.params.kegNumber);

        db.getCurrentKegConfigs(req.user,function(err,configs){

        	var kegs = [0,1];

        	db.getSensorDataForLast(req.user,kegs,3*60*60*1000,function(err,sensorData){
	           	res.render('setup.jade', 
	           		{
                        configs:configs,
                        beerUnits:req.user.beerUnits,
	           			sensorData:sensorData,
                        temperatureUnits:req.user.temperatureUnits
	           		});

        	});
        })

    });

    app.post('/setup/beerUnits', isLoggedIn, function(req, res) {

        var configData = req.body.config;

        db.setBeerUnits(req.user,configData,function(err){
            if(!err){
                res.send({status:"Success"});
            }else{
                res.error();
            }
        })


    });

    app.post('/setup/temperatureUnits', isLoggedIn, function(req, res) {

        var configData = req.body.config;

        db.setTemperatureUnits(req.user,configData,function(err){
            if(!err){
                res.send({status:"Success"});
            }else{
                res.error();
            }
        })


    });

};
