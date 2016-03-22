var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../server/server.js'); //path to app.js or server.js


// The context object to hold the created models.
// You can use `this` in mocha test instead.
var context = {};
var KpIndex;


describe('/KpIndex', function() {
  lt.beforeEach.withApp(app);
  lt.describe.whenCalledRemotely('GET', '/api/KpIndices', function () {

    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });

    lt.beforeEach.givenModel('KpIndex',{
      date: new Date()
    });
    it('should respond with an array of KpIndices', function () {
      console.log(this.res.body);
      assert(Array.isArray(this.res.body));

    });
  });

  lt.describe.whenCalledRemotely('GET', '/api/KpIndices/count', function () {

    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });

    it('should respond with an number ', function () {
      console.log(this.res.body);
      assert.notEqual(this.res.body.count, undefined);
      assert.equal(this.res.body.count, 0);


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