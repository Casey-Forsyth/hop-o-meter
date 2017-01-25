

// load up the user model
var User            = require('./model/user');

var mongoose = require('mongoose');

var configDB = require('../config/database.js');

mongoose.connect(configDB.url);



function findUserByEmail (email,cb) {

	User.findOne({ 'local.email' :  email }, function(err, user) {
   		cb(err,user);
   	});
}


function findUserById (id,cb) {

	User.findById(id,{local:1,appAPIKey:1,publicViewingKey:1,kegMeterApiKey:1}, function(err, user) {
        cb(err, user);
    });
}

function saveUser (newUser,cb) {
	
	newUser.save(cb);

}

module.exports = {
	'findUserByEmail':findUserByEmail,
	'findUserById':findUserById,
	'saveUser':saveUser
} 