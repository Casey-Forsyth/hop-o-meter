var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// define the schema for our user model
var batchSchema = mongoose.Schema({

    kegNum:{ type: Number, min: 0, max: 99 },
    beer:{
    	name:String,
    	color:String
    },
    startedAt:{ type: Date, default: Date.now },
    endedAt:{ type: Date},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
	ml:[]

});

batchSchema.pre("save", function (next) {
  delete this.ml
  next()
})



module.exports = mongoose.model('Batch', batchSchema);