

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// define the schema for our user model
var temperaturePointSchema = mongoose.Schema({

    value:Number,
    recordedAt:{ type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' }

});




// create the model for users and expose it to our app
module.exports = mongoose.model('TemperaturePoint', temperaturePointSchema);