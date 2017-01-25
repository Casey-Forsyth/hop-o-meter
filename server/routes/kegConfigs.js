// app/batches.js


var db            = require('../db/db.js');
var isLoggedIn = require('./isLoggedIn');


module.exports = function(app, passport) {

    app.get('/kegConfig', isLoggedIn, function(req, res) {

        var start = parseInt(req.params.start);
        var end = parseInt(req.params.end);
        var kegNumber = parseInt(req.params.kegNumber);

        db.getCurrentKegConfigs(req.user,function(err,configs){

        	var kegs = [];
        	for (var i = 0; i < configs.length; i++) {
        		kegs.push(configs[i].kegNum)
        	};

        	db.getSensorDataForLast(req.user,kegs,3*60*60*1000,function(err,sensorData){
	           	res.render('kegConfig.jade', 
	           		{
	           			configs:configs,
	           			sensorData:sensorData
	           		});

        	});
        })

    });


    app.post('/kegConfig/:kegID', isLoggedIn, function(req, res) {

        var kegID = parseInt(req.params.kegID);
        var configData = req.body.config;

        db.setKegConfig(req.user,kegNumber,configData,function(err){
        	if(!err){
	            res.send({status:"Success"});
	        }else{
	        	res.error();
	        }
        })

    });

};
