
// load up the user model
var User            = require('./model/user');
var SensorPoint     = require('./model/sensorPoint');
var Batch     		= require('./model/batch');
var KegConfig     		= require('./model/kegConfig');
var TemperaturePoint     		= require('./model/temperaturePoint');

var mongoose = require('mongoose');

var configDB = require('../config/database.js');

mongoose.connect(configDB.url);


function findUserByEmail (newEmail,cb) {

	User.findOne({ 'local.email' :  newEmail }, function(err, user) {
   		cb(err,user);
   	});
}


function findUserById (id,cb) {

	User.findById(id,{local:1,appAPIKey:1,publicViewingKey:1,kegMeterApiKey:1,beerUnits:1,temperatureUnits:1}, function(err, user) {
	        cb(err, user);
	});
}


function findUserByViewKey (key,cb) {
	User.findOne({ 'publicViewingKey' :  key }, function(err, user) {
   		cb(err,user);
   	});
}

function findUserByKegMeterApiKey (key,cb) {
	User.findOne({ 'kegMeterApiKey' :  key }, function(err, user) {
   		cb(err,user);
   	});
}

function saveUser (user,cb) {

	user.save(cb);
	
}

function setBeerUnits (user,newConfig,cb) {

	if(typeof newConfig == 'undefined' ||
		typeof newConfig.name == 'undefined' ||
		typeof newConfig.sizeInML == 'undefined'){
		cb("Missing Needed Config Values");
	}

	user.beerUnits = newConfig;
	user.save(cb);
	
}

function setTemperatureUnits (user,newConfig,cb) {

	if(typeof newConfig == 'undefined' ||
		typeof newConfig.shortName == 'undefined' ||
		typeof newConfig.longName == 'undefined' ||
		typeof newConfig.ratio == 'undefined' ||
		typeof newConfig.offset == 'undefined'){
		cb("Missing Needed Config Values");
	}

	user.temperatureUnits = newConfig;
	user.save(cb);
	
}




function getSensorPoint (user,kegNum,start,end,cb){

	var start = new Date(start);
	var end = new Date(end);

	SensorPoint.find({ 'user' :  user,
					'kegNum':kegNum,
					'recordedAt':{ $gt: start, $lt: end } 
				}, 
				function(err, points) {
			   		cb(err,points,kegNum);
			   	});
}


function getSensorDataForLast (user,kegs,period,cb) {
	var now = Date.now();

	var out = {};
	var dataCount = 0;
	var errorFound = false;



	if(kegs.length>0)
	{
		for (var i = 0; i < kegs.length; i++) {

			getSensorPoint(user,kegs[i],now-period,now,function (err,data,kegNumReturn) {
				
				out[kegNumReturn] = data
				dataCount++;

				if(err){
					cb(err);
					errorFound = true;
				}

				if(dataCount >= kegs.length && !errorFound){
					cb(null,out);
				} 

			});
		};
	}else{
		cb("Error: Missing List",out);
	}


	
}

function setNewBatch (user,kegNum,beerName,beerColor,cb) {

	var batch = new Batch({
		user:user,
		kegNum:kegNum,
		beer:{
			name:beerName,
			color:beerColor,
		}
	});

	batch.save(cb)

}

function getNewestBatches (user,cb) {

	var out = [];
	var kegs = [0,1];
	var dataCount = 0;
	var errorFound = false;


	for (var i = 0; i < kegs.length; i++) {

		var q = {
			'user':user,
			'kegNum':kegs[i]
		};

		Batch.findOne(q,{},{ sort: { 'startedAt' : -1 } },function (err,data) {
			
			if(!data){
				data = {error:"No Batch Set"};
			}
			out.push(data);
			dataCount++;

			

			if(dataCount >= kegs.length){
				cb(null,out);
			} 

		});
	};
	
}

function getCurrentKegConfigs (user,cb) {

	var out = [];
	var kegs = [0,1];
	var dataCount = 0;
	var errorFound = false;


	for (var i = 0; i < kegs.length; i++) {


		getCurrentKegConfig(user,kegs[i],function (err,data) {
			
			

			if(err){
				cb(err);
				errorFound = true;
				data = {error:"None Set"}
			}
			out.push( data )
			dataCount++;

			if(dataCount >= kegs.length && !errorFound){
				cb(null,out);
			} 

		});
	};
}


function getCurrentKegConfig (user,kegNum,cb) {

	var q = {
		'user':user,
		'kegNum':kegNum
	};

	KegConfig.findOne(q,{},{ sort: { 'setAtTime' : -1 } },function(err,config){
		if(err || !config){
			return cb(null,new KegConfig({user:user,kegNum:kegNum}));
		}else{
			return cb(null,config);
		}
	});

}

function setKegConfig (user,kegID,configData,cb) {
	


	var config = new KegConfig({

	    kegNum:kegID,
	    minV:configData.minV,
	    maxV:configData.maxV,
	    sizeMl:configData.sizeMl,
	    user: user

	});

	config.save(cb);

}

function getTemperatures (user, start, end ,cb) {

	var start = new Date(start);
	var end = new Date(end);

	TemperaturePoint.find({ 'user' :  user,
					'recordedAt':{ $gt: start, $lt: end } 
				}, 
				function(err, points) {
			   		cb(err,points);
			   	});


}


function insertNewSensorData (kegMeterApiKey,kegNum,val ,cb) {

	findUserByKegMeterApiKey(kegMeterApiKey,function(err,user){
		if(user){
			var point = new SensorPoint({
				'kegNum':kegNum,
				'user':user,
				'value':val
			});

			point.save(cb);

		}else{
			cb("No User Found")
		}
	});


}

function insertNewTemperatureData (kegMeterApiKey,val ,cb) {

	findUserByKegMeterApiKey(kegMeterApiKey,function(err,user){
		if(user){
			var point = new TemperaturePoint({
				'user':user,
				'value':val
			});
			point.save(cb);
		}else{
			cb("No User Found")
		}

		
	});

}


module.exports = {
	'findUserByEmail':findUserByEmail,
	'findUserById':findUserById,
	'findUserByViewKey':findUserByViewKey,
	'saveUser':saveUser,
	'getSensorPoint':getSensorPoint,
	'getSensorDataForLast':getSensorDataForLast,
	'getNewestBatches':getNewestBatches,
	'getCurrentKegConfig':getCurrentKegConfig,
	'getCurrentKegConfigs':getCurrentKegConfigs,
	'setKegConfig':setKegConfig,
	'getTemperatures':getTemperatures,
	'setBeerUnits':setBeerUnits,
	'setTemperatureUnits':setTemperatureUnits,
	'insertNewSensorData':insertNewSensorData,
	'insertNewTemperatureData':insertNewTemperatureData,
	'setNewBatch':setNewBatch
} 