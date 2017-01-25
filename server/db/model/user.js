// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var randToken = require('rand-token');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    beerUnits:{
        name:{ type: String, default: "Imperial Pints" },
        sizeInML:{ type: String, default: 568  }
    },
    kegMeterApiKey : {
        type: String,
        default: function() {
            return randToken.generate(64);
        } 
    },
    publicViewingKey : {
        type: String,
        default: function() {
            return randToken.generate(64);
        } 
    },
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};




// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);