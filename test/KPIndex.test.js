var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); //path to app.js or server.js


var KpIndex;

var TestDataBuilder = require('loopback-testing').TestDataBuilder;
var ref = TestDataBuilder.ref;

// The context object to hold the created models.
// You can use `this` in mocha test instead.
var context = {};

var ref = TestDataBuilder.ref;



/**
 * Tests for KPIndex route
 */
describe('/KpIndex', function() {
  this.timeout(5000);
  lt.beforeEach.withApp(app);

  /**
   * Wait for app to get started
   * @Todo modify to real async processing instead of only wait and hope.
   */
  beforeEach(function(callback){
    setTimeout(callback,1000)
  });
  lt.describe.whenCalledRemotely('GET', '/api/KpIndices', function () {

    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });

    lt.beforeEach.givenModel('KpIndex',{
      date: new Date()
    });
    it('should respond with an array of KpIndices', function () {
      assert(Array.isArray(this.res.body));

    });
  });

  lt.describe.whenCalledRemotely('GET', '/api/KpIndices/count', function () {

    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });

    it('should respond with an number ', function () {
      assert.notEqual(this.res.body.count, undefined);
      assert.ok(this.res.body.count > 0);


    });
  });

  lt.describe.whenCalledRemotely('GET', '/api/KpIndices/current', function () {

    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });

    it('should respond with one KPIndex entry ', function () {

      assert(this.res.body instanceof  Object);
      assert(this.res.body.hasOwnProperty("date"));
      assert(this.res.body.hasOwnProperty("utc"));
      assert(this.res.body.hasOwnProperty("kpValue"));

    });
  });

});


/*
 describe('/admin', function() {
 lt.beforeEach.withApp(app);

 // All tests below this will execute with the same user on the same role.
 // Use individual 'whenCalledByUserWithRole' describes if you want to
 // create and tear down the user each test.
 lt.describe.whenLoggedInAsUserWithRole({username:"test", password:"test"}, 'admin', function() {

 lt.describe.whenCalledRemotely('POST', '/makeAnnouncement', function() {
 lt.it.shouldBeAllowed();
 });

 lt.describe.whenCalledRemotely('POST', '/analytics', function() {
 lt.it.shouldBeAllowed();
 });

 });
 });
 */