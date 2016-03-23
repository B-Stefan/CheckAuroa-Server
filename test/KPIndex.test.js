var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); //path to app.js or server.js
var moment = require("moment")

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


  lt.describe.whenCalledRemotely('GET', '/api/KpIndices/prediction', function () {

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

    it('should return more then one item', function () {
      assert.ok(this.res.body.length > 1)
    });

    it('should contains only future items', function () {

      var currentUTCDateInUNIX = moment.utc().unix();
      var results = this.res.body.filter((item)=>{
         return item.utc < currentUTCDateInUNIX;
      });
      assert.equal(results.length, 0);

    });
  });


  lt.describe.whenCalledRemotely('GET', '/api/KpIndices/prediction/daily', function () {

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

    it('should return exact 3 items', function () {
      assert.ok(this.res.body.length === 3 )
    });


    it('KpValue of Min should never be greater then max ', function () {

      var arr = this.res.body.map(function (item){
          return item.max.kpValue - item.min.kpValue;
      }).filter(function (difference){
        return difference < 0;
      });

      assert.equal(arr.length, 0 );
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