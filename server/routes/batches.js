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

};

