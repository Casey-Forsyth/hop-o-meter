// app/sensorValues.js


var db            = require('../db/db.js');
var isLoggedIn = require('./isLoggedIn');


module.exports = function(app, passport) {

    app.get('/sensorPoints/:kegNumber/:start/:end', isLoggedIn, function(req, res) {

        var start = parseInt(req.params.start);
        var end = parseInt(req.params.end);
        var kegNumber = parseInt(req.params.kegNumber);

        db.getAbstractWeightPoints(req.user,kegNumber,start,end,function(points){
            res.send({points:points});
        })

    });

};

