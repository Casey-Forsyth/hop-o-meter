var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// define the schema for our user model
var batchSchema = mongoose.Schema({

    kegNum:{ type: Number, min: 0, max: 99 },
    minV:{ type: Number, default: 0 },
    maxV:{ type: Number, default: 5 },
    sizeMl:{ type: Number, default: 19000 },
    setAtTime:{ type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' }

});



module.exports = mongoose.model('KegConfig', batchSchema);