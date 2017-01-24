// app/models/weightPoint.js
// load the things we need
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// define the schema for our user model
var sensorPointSchema = mongoose.Schema({

    kegNum:{ type: Number, min: 0, max: 99 },
    value:Number,
    recordedAt:{ type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' }

});




// create the model for users and expose it to our app
module.exports = mongoose.model('SensorPoint', sensorPointSchema);