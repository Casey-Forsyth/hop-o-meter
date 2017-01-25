// app/routes.js


var db            = require('../db/db.js');
var isLoggedIn = require('./isLoggedIn');


module.exports = function(app, passport) {

    // =====================================
    // BATCH PAGE (with charts) ========
    // =====================================
    app.get('/batches', isLoggedIn, function(req,res){
        displayBatchView(req.user, res);
    });

    app.get('/batches/:viewKey', function(req, res) {

        db.findUserByViewKey(req.params.viewKey,function (err,user) {
            displayBatchView(user,res)
        })
        
    });

    function displayBatchView (user,res) {
        db.getNewestBatches(user,function(err,batches){
            res.render('batch.jade', {
                batchView : user.beerUnits,
                batches : batches 
            });
        })
    }







};

