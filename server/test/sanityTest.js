var should = require('should');

describe('Sanity Check', function() {
	it('5 should equal 5', function() {
	  (5).should.be.exactly(5).and.be.a.Number();
	});
	it('5 should not equal 6', function() {
	  (5).should.not.be.exactly(6).and.be.a.Number();
	});
});