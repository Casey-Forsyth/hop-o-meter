

// load up the user model
var User            = require('./model/user');
var WeightPoint     = require('./model/weightPoint');
var Batch     		= require('./model/batch');

var passHash = "$2a$08$WVKd/FgUmhwcSZWCZAZ8XenV25pFe4Q.sY80uvthSAj7vAjh1VoUS";
var testEmail = "test.invalid"
var userInstance = new User({local:{
    	    email        : testEmail,
        	password     : passHash,
	    }
	});






var STEPSIZE = 15*60*1000
function generateFakeWeights (kegNum,start,end,low,high,fillPeriod) {
	
	var out = [];

	var cT = start;
	console.log(cT)

	while (cT < end) {
		console.log(cT)

		var posInCycle = (cT % fillPeriod)/fillPeriod
		var heightChange = low - high;
		var val = high + heightChange * posInCycle

		out.push(new WeightPoint({
			kegNum:kegNum,
			value:val,
			recordedAt:new Date(cT),
			user:userInstance
		}));

		cT = cT + STEPSIZE;

	}

	return out
}
















function findUserByEmail (newEmail,cb) {

	console.log("Looing for :"+newEmail);
    cb(null,userInstance);

}


function findUserById (id,cb) {

	cb(null,userInstance);

}

function saveUser (user,cb) {

	cb(null)
	
}


function getSensorPoint(user,kegNum,start,end,cb){

	cb(generateFakeWeights(kegNum,start,end,0.1,5.4,24*60*60*1000))

}


function getBatches(user,start,end,cb){

	var out = [];

	out.push(new Batch({kegNum:0,
			    minV:5.5,
			    maxV:0,
			    sizeMl:19000,
			    startedAt:start,
			    user: user));


	out.push(new Batch({kegNum:1,
			    minV:5.5,
			    maxV:0,
			    sizeMl:19000,
			    startedAt:start,
			    user: user));


	out.push(new Batch({kegNum:0,
			    minV:5.5,
			    maxV:0,
			    sizeMl:19000,
			    startedAt:start+24*60*60*1000,
			    user: user));


	out.push(new Batch({kegNum:1,
			    minV:5.5,
			    maxV:0,
			    sizeMl:19000,
			    startedAt:start+24*60*60*1000,
			    user: user));



	cb(null,out)

}

module.exports = {
	'findUserByEmail':findUserByEmail,
	'findUserById':findUserById,
	'saveUser':saveUser,
	'getAbstractWeightPoints':getAbstractWeightPoints
} 