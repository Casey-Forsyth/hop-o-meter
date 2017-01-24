var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// define the schema for our user model
var batchSchema = mongoose.Schema({

    kegNum:{ type: Number, min: 0, max: 99 },
    minV:Number,
    maxV:Number,
    sizeMl:Number,
    startedAt:{ type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' }

});



module.exports = mongoose.model('Batch', batchSchema);