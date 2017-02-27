

// load up the user model
var User            = require('./model/user');
var SensorPoint     = require('./model/sensorPoint');
var Batch     		= require('./model/batch');
var KegConfig     		= require('./model/kegConfig');
var TemperaturePoint     		= require('./model/temperaturePoint');

var passHash = "$2a$08$.r65Be7obffOBkUKnDfR7ejdwBUoCYDR./TWTPZCS73FkKCWzDTCy";
var testEmail = "test.invalid"
var userInstance = new User({local:{
    	    email        : testEmail,
        	password     : passHash,
	    }
	});






var STEPSIZE = 1*60*1000
hours = 1
function generateSensorPoints (kegNum,start,end,low,high,fillPeriod) {
	
	var out = [];

	var cT = start.getTime();
	var start = start.getTime();
	var end = end.getTime();

	while (cT < end) {
		var posInCycle = ((cT-start) % (fillPeriod))/fillPeriod
		var heightChange = low - high;
		var val = high + heightChange * posInCycle

		out.push(new SensorPoint({
			kegNum:kegNum,
			value:val,
			recordedAt:new Date(cT),
			user:userInstance
		}));

		cT = cT + STEPSIZE;

	}
	hours = (hours +1) % 12
	return out
}





function findUserByEmail (newEmail,cb) {

	console.log("Looing for :"+newEmail);
    cb(null,userInstance);

}


function findUserById (id,cb) {

	cb(null,userInstance);

}

function findUserByViewKey (key,cb) {
	cb(null,userInstance);
}

function saveUser (user,cb) {

	cb(null)
	
}

function setBeerUnits (user,newConfig,cb) {

	cb(null)
	
}

function setTemperatureUnits (user,newConfig,cb) {

	cb(null)
	
}




function getSensorPoint (user,kegNum,start,end,cb){

	var bottom = Math.random() * 3.0;
	var start = new Date(start);
	var end = new Date(end)
	cb(null,generateSensorPoints(kegNum,start,end,bottom,5.4,end.getTime() - start.getTime() ));

}


function getSensorDataForLast (user,kegs,period,cb) {
	var now = Date.now();

	var out = {};
	var dataCount = 0;
	for (var i = 0; i < kegs.length; i++) {

		getSensorPoint(user,kegs[i],now,now+period,function (err,data) {
			
			out[kegs[i]] = data
			dataCount++;

			if(dataCount >= kegs.length){
				cb(null,out);
			} 

		});
	};


	
}

function getNewestBatches (user,cb) {

	var out = [];

	var start = Date.now() - 24*60*60*1000;



	out.push(new Batch({kegNum:0,
				beer:{name:"Amber Ale", color:"#b74300"},
			    startedAt:start,
			    user: user,
				ml:[]}));


	out.push(new Batch({kegNum:1,
				beer:{name:"Cream Ale", color:"#ed9717"},
			    startedAt:start,
			    user: user,
				ml:[]}));


	cb(null,out)

	
}

function getCurrentKegConfigs (user,cb) {

	var out = [];
	out[0] = new KegConfig({

	    kegNum:0,
	    minV:0.1,
	    maxV:5.5,
	    sizeMl:19000,
	    user: user

	});

	out[1]= new KegConfig({

	    kegNum:1,
	    minV:0.1,
	    maxV:5.5,
	    sizeMl:19000,
	    user: user

	});




	cb(null,out);
}


function getCurrentKegConfig (user,kegNum,cb) {

	getCurrentKegConfigs(user,function (err,configs) {

		var toSend = configs[kegNum];
		if(toSend){
			cb(null,toSend);
		}else{
			cb("Missing Config",null);
		}

	})

}

function setKegConfig (user,config,configData,cb) {
	cb(null)
}


var FAKE_TOP = 10;
var FAKE_BOTTOM = 5;
var FAKE_PERIOD = 24*60*60*1000;

function getTemperatures (user, start, end ,cb) {

	var out = [];

	var cT = start.getTime();
	var start = start.getTime();
	var end = end.getTime();


	
	while (cT < end){


		out.push(new TemperaturePoint({
			recordedAt:cT,
			value: Math.sin(((cT-start)/FAKE_PERIOD) * Math.PI) * (FAKE_TOP - FAKE_BOTTOM)/2 + FAKE_BOTTOM + (FAKE_TOP - FAKE_BOTTOM)/2
		}))

		cT += 60*60*1000;
	}

	cb(null,out)

}


function insertNewSensorData (kegMeterApiKey,kegNum,val ,cb) {

	cb(null)

}

function insertNewTemperatureData (kegMeterApiKey,val ,cb) {

	cb(null)

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
	'insertNewTemperatureData':insertNewTemperatureData
} 