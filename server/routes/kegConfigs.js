// app/batches.js


var db            = require('../db/db.js');
var isLoggedIn = require('./isLoggedIn');


module.exports = function(app, passport) {

    app.post('/kegConfig/:kegID', isLoggedIn, function(req, res) {

        var kegID = parseInt(req.params.kegID);
        var configData = req.body.config;

        db.setKegConfig(req.user,kegID,configData,function(err){
        	if(!err){
	            res.send({status:"Success"});
	        }else{
	        	res.error();
	        }
        })

    });

};
