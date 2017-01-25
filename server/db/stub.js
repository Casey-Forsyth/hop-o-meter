

// load up the user model
var User            = require('./model/user');
var SensorPoint     = require('./model/sensorPoint');
var Batch     		= require('./model/batch');
var KegConfig     		= require('./model/kegConfig');

var passHash = "$2a$08$.r65Be7obffOBkUKnDfR7ejdwBUoCYDR./TWTPZCS73FkKCWzDTCy";
var testEmail = "test.invalid"
var userInstance = new User({local:{
    	    email        : testEmail,
        	password     : passHash,
	    }
	});






var STEPSIZE = 1*60*1000
function generateFakeWeights (kegNum,start,end,low,high,fillPeriod) {
	
	var out = [];

	var cT = start;
	console.log(cT)

	while (cT < end) {
		console.log(cT)

		var posInCycle = (cT % fillPeriod)/fillPeriod
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

	return out
}


hours = 1
function generateFakeML(full,start,end){
	var out = [];
	var cT = start;

	while(cT<end- (12 - hours)*60*60*1000){
		var per = (cT-start) / (end - start)
		out.push({ml:full - full*per, t: cT});
		cT = cT + STEPSIZE;
	}

	hours = (hours +1) % 12

	return out;
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

function saveNewKegConfig (user,cb) {

	cb(null)
	
}




function getSensorPoint (user,kegNum,start,end,cb){

	cb(generateFakeWeights(kegNum,start,end,0.1,5.4,24*60*60*1000))

}


function getSensorDataForLast (user,kegs,period,cb) {
	var now = Date.now();

	var out = {};
	var dataCount = 0;
	for (var i = 0; i < kegs.length; i++) {
		
		getSensorPoint(user,kegs[i],now,now+period,function (data) {
			
			out[kegs[i]] = data
			dataCount++;

			if(dataCount >= kegs.length){
				cb(null,out);
			} 

		});
	};


	
}


function getAllBatches(user,start,end,cb){

	var out = [];

	out.push(new Batch({kegNum:0,
				beer:{name:"Amber Ale", color:"#FF0000"},
			    startedAt:start,
			    user: user,
				ml:generateFakeML(19000,start,start + 18*60*60*1000)}));


	out.push(new Batch({kegNum:1,
				beer:{name:"Cream Ale", color:"#FF0000"},
			    startedAt:start,
			    user: user,
				ml:generateFakeML(19000,start,start + 18*60*60*1000)}));


	out.push(new Batch({kegNum:0,
				beer:{name:"Honey Hops", color:"#FF0000"},
			    startedAt:start+24*60*60*1000,
			    user: user,
				ml:generateFakeML(19000,start+24*60*60*1000,start + 42*60*60*1000)}));


	out.push(new Batch({kegNum:1,
				beer:{name:"Blond", color:"#FF0000"},
			    startedAt:start+24*60*60*1000,
			    user: user,
				ml:generateFakeML(19000,start+24*60*60*1000,start + 42*60*60*1000)}));

	cb(null,out)

}


function getNewestBatches (user,cb) {

	var out = [];

	var start = Date.now();

	out.push(new Batch({kegNum:0,
				beer:{name:"Amber Ale", color:"#b74300"},
			    startedAt:start,
			    user: user,
				ml:generateFakeML(19000,start,start + 18*60*60*1000)}));


	out.push(new Batch({kegNum:1,
				beer:{name:"Cream Ale", color:"#ed9717"},
			    startedAt:start,
			    user: user,
				ml:generateFakeML(19000,start,start + 18*60*60*1000)}));


	cb(null,out)
}




function getCurrentKegConfigs (user,cb) {

	var out = [];
	out.push(new KegConfig({

	    kegNum:0,
	    minV:0.1,
	    maxV:5.5,
	    sizeMl:19000,
	    user: user

	}));

	out.push(new KegConfig({

	    kegNum:1,
	    minV:0.1,
	    maxV:5.5,
	    sizeMl:19000,
	    user: user

	}));

	cb(null,out);
}

module.exports = {
	'findUserByEmail':findUserByEmail,
	'findUserById':findUserById,
	'findUserByViewKey':findUserByViewKey,
	'saveUser':saveUser,
	'getSensorPoint':getSensorPoint,
	'getSensorDataForLast':getSensorDataForLast,
	'getNewestBatches':getNewestBatches,
	'getCurrentKegConfigs':getCurrentKegConfigs
} 