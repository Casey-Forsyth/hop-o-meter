var db            	= require('../db/db.js');
var volumeLogic		= require('./volumeLogic.js')




function getNewestBatchesForAllKegs (user,cb) {

	if(!user){
		cb("No User Set")
	}else{
		db.getNewestBatches(user,function (err,batches) {
		
			var count = 0;
			for (var i = 0; i < batches.length; i++) {
				var curBatch = batches[i]
				var start 	= curBatch.startedAt;
				var end		= new Date();
				var kegNum	= curBatch.kegNum;

				volumeLogic.getVolumeMeasurements(start,end,user,kegNum,function (err,kegNum,volume) {
					
					if(err){
						batches[kegNum] = {error:err};
					}else{
						batches[kegNum].ml = volume;
					}

					count++
					
					if(count >= batches.length){
						cb(null,batches)
					}

				});
			};


		})
	
	}
	

	



}



module.exports = {"getNewestBatchesForAllKegs":getNewestBatchesForAllKegs}
