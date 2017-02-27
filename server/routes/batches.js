// app/batches.js


var db            = require('../db/db.js');
var isLoggedIn = require('./isLoggedIn');


module.exports = function(app, passport) {

    app.get('/batches/recent', isLoggedIn, function(req, res) {

        var start = parseInt(req.params.start);
        var end = parseInt(req.params.end);
        var kegNumber = parseInt(req.params.kegNumber);

        db.getNewestBatches(req.user,function(err,batches){
            res.send({batches:batches});
        })

    });

    app.post('/batch/new', isLoggedIn, function(req, res) {

        var beerName = req.body.beer.name;
        var beerColor = req.body.beer.color;
        var kegNum = parseInt(req.body.kegNum);

        db.setNewBatch (req.user,kegNum,beerName,beerColor,function(err){
            if(!err){
                res.send({'success':true});
            }else{
                res.status(500).send(err);
            }
            
        })

    });

};

