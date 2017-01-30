// app/routes.js


var batchesLogic            = require('../logic/batchesLogic.js');
var db            = require('../db/db.js');
var isLoggedIn = require('./isLoggedIn');


module.exports = function(app, passport) {

    // =====================================
    // BATCH PAGE (with charts) ========
    // =====================================
    app.get('/batches', isLoggedIn, function(req,res){
        displayBatchView(req.user, res,{});
    });

    app.get('/batches/admin', isLoggedIn, function(req,res){
        displayBatchView(req.user, res,{admin:true});
    });

    app.get('/batches/:viewKey', function(req, res) {

        db.findUserByViewKey(req.params.viewKey,function (err,user) {
            displayBatchView(user,res,{})
        })
        
    });

    function displayBatchView (user,res,options) {
        batchesLogic.getNewestBatchesForAllKegs(user,function(err,batches){

            var end = new Date();
            var start = new Date(end.getTime() - 7*24*60*60*1000);

            db.getTemperatures(user,start,end,function(err,temperatures){
                res.render('batch.jade', {
                    batchView : user.beerUnits,
                    batches : batches,
                    temperatureUnits : user.temperatureUnits,
                    temperatures : temperatures,
                    admin:!!options.admin
                });
            });
        });
    }







};

