var db            	= require('../db/db.js');




function getVolumeMeasurements (start,end,user,kegNum,cb) {
	
	db.getSensorPoint(user,kegNum,start,end,function (err,sensorPoints) {

		db.getCurrentKegConfig(user,kegNum,function (err,config) {
			if( typeof config =='undefined' || config == null || err){
				cb("Missing Configuration",kegNum,null);
			}else{
				if(sensorPoints && sensorPoints.length>0){
					var mls = process(config,sensorPoints);
					cb(null,kegNum,mls);
				} else {
					cb("Missing Data Points",kegNum,null);
				}
				
			}
		})
		
	})

}


function process (singleConfig,rawSignals) {
	
	var out = [];
	var min = singleConfig.minV;
	var max = singleConfig.maxV;
	var size = singleConfig.sizeMl;

	var mlPerV = size / (max - min);


	for (var i = 0; i < rawSignals.length; i++) {
		var t = rawSignals[i].recordedAt;
		var ml = mlPerV * rawSignals[i].value;
		out.push({t:t.getTime()	,ml:ml});
	};

	return out

}





module.exports = {"getVolumeMeasurements":getVolumeMeasurements};