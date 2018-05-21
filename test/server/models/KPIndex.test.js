const assert = require('assert')
const bootstrap = require('../../../server/server.js') // path to app.js or server.js
const moment = require('moment')
const supertest = require('supertest')
/**
 * Tests for KPIndex route
 */
describe('/KpIndex', function () {
  this.timeout(10000)

  beforeEach(async function () {
    const {app, server} = await bootstrap()
    this.app = app
    this.server = server
  })
  afterEach(function (callback) {
    this.server.close(callback)
  })

  describe('GET /api/KpIndices/count', function () {
    it('should be allowed', async function () {
      await supertest(this.server)
        .get('/api/KpIndices/count')
        .expect(200)
    })

    it('should have statusCode 200', async function () {
      await supertest(this.server)
        .get('/api/KpIndices/count')
        .expect(200)
    })

    it('should respond with an number ', async function () {
      const { body } = await supertest(this.server)
        .get('/api/KpIndices/count')
        .expect(200)
      assert.notEqual(body.count, undefined)
      assert.ok(body.count > 0)
    })
  })

  describe('GET /api/KpIndices/current', function () {
    it('should be allowed', async function () {
      await supertest(this.server)
        .get('/api/KpIndices/current')
        .expect(200)
    })

    it('should have statusCode 200', async function () {
      await supertest(this.server)
        .get('/api/KpIndices/current')
        .expect(200)
    })

    it('should respond with one KPIndex entry ', async function () {
      const { body } = await supertest(this.server)
        .get('/api/KpIndices/current')
        .expect(200)

      assert(body instanceof Object)
      assert(body.hasOwnProperty('date'))
      assert(body.hasOwnProperty('utc'))
      assert(body.hasOwnProperty('kpValue'))
    })
  })

  describe('GET /api/KpIndices/prediction', function () {
    const path = '/api/KpIndices/prediction'

    it('should be allowed', async function () {
      await supertest(this.server)
        .get(path)
        .expect(200)
    })

    it('should have statusCode 200', async function () {
      await supertest(this.server)
        .get(path)
        .expect(200)
    })

    it('should respond with an array of KpIndices', async function () {
      const { body } = await supertest(this.server)
        .get(path)
        .expect(200)
      assert(Array.isArray(body))
    })

    it('should return more then one item', async function () {
      const { body } = await supertest(this.server)
        .get(path)
        .expect(200)
      assert.ok(body.length > 1)
    })

    it('should contains only future items', async function () {
      const { body } = await supertest(this.server)
        .get(path)
        .expect(200)

      const currentUTCDateInUNIX = moment.utc().unix()
      const results = body.filter((item) => {
        return item.utc < currentUTCDateInUNIX
      })
      assert.equal(results.length, 0)
    })
  })

  /*
  /**
  * Not supported right now
  * */
  /*
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

    it('should not contain any past kpInformation', function () {

      var now  = moment.utc().unix();
      var arr = this.res.body.filter(function (item){
          return moment(item.min.date).unix() < now || moment(item.max.date).unix() < now
      });

      assert.equal(arr.length, 0 );
    });

  });
   */
})
