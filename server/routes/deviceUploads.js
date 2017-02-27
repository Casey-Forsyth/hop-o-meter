// app/deviceUploads.js


var db            = require('../db/db.js');


module.exports = function(app, passport) {


    app.post('/sensorPoint/add', function(req, res) {

        var kegMeterApiKey = req.body.kegMeterApiKey;
        var val = req.body.val;
        var kegNum = req.body.kegNum;

        if(typeof kegMeterApiKey != 'undefined' &&
            typeof val != 'undefined' &&
            typeof kegNum != 'undefined')
        
        db.insertNewSensorData(kegMeterApiKey,kegNum,val,function(err){
            if(!err){
                res.send({status:"Success"});
            }else{
                res.status(400).send(err);
            }
        })


    });


    app.post('/temperature/add', function(req, res) {

        var kegMeterApiKey = req.body.kegMeterApiKey;
        var val = req.body.val;

        if(typeof kegMeterApiKey != 'undefined' &&
            typeof val != 'undefined')
        
        db.insertNewTemperatureData(kegMeterApiKey,val,function(err){
            if(!err){
                res.send({status:"Success"});
            }else{
                res.status(400).send(err);

            }
        })


    });




};
