var should = require('should');
var batchLogic = require('../logic/batchesLogic.js')
var User = require('../db/model/user.js')


var passHash = "$2a$08$.r65Be7obffOBkUKnDfR7ejdwBUoCYDR./TWTPZCS73FkKCWzDTCy";
var testEmail = "test.invalid"
var userInstance = new User({local:{
    	    email        : testEmail,
        	password     : passHash,
	    }
	});


describe('Batch Logic', function() {

	it('Should return err with no user set', function() {
	  batchLogic.getNewestBatchesForAllKegs(null,function(err,batches){

	  	(err).should.be.exactly("No User Set").and.be.a.String();
	  	(!batches).should.be.true();

	  });
	});

	it('Should return no err with user set', function() {
	  batchLogic.getNewestBatchesForAllKegs(userInstance,function(err,batches){
	  	(err === null).should.be.true();
	  });
	});

	it('Should return batches', function() {
	  batchLogic.getNewestBatchesForAllKegs(userInstance,function(err,batches){
	  	(batches).should.be.a.Array();
	  });
	});




});