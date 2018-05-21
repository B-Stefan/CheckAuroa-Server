
import KPIndexServiceRedisCached from './../../../../server/services/aurora-services/KPIndexServiceRedisCached'
import assert from 'assert'
import moment from 'moment'

describe('KpIndexServiceRedisCached', function () {
  describe.skip('connectClient', function () {
    it('should connect to server', function () {
      let instance = new KPIndexServiceRedisCached('apps.conts.de', 6379, process.env.REDIS_PASS)
      return instance.connectToRedisServer()
    })

    it('should NOT connect to server', function () {
      let instance = new KPIndexServiceRedisCached('apps.conts.de', 6379, 'wrong')
      return new Promise((resolve, reject) => {
        instance.connectToRedisServer().then(reject).catch(resolve)
      })
    })
  })
})
