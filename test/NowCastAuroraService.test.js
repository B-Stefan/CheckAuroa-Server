import NowCastAuroraService from "./../server/aurora-services/NowCastAuroraService";
import assert from "assert"


describe('NowCastAuroraService', function() {

  this.timeout(100000);

  it("should response a list of nowcast ", function (callback) {
    new NowCastAuroraService()
        .getList()
        .then(function (result) {
          assert.strictEqual(result.entries.length,NowCastAuroraService.rowCountExpected);
          assert.strictEqual(result.entries[0].length,NowCastAuroraService.colCountExpected);
          callback();
        }).catch((err)=>{
          throw new Error(err)
        })

  });

  it("should equal zero probability in london and somewhere in africa", function (callback) {
    new NowCastAuroraService()
        .getList()
        .then(function (result) {
          assert.equal(0,NowCastAuroraService.getProbabilityByLatLng(result.entries,0,0));
          assert.equal(0,NowCastAuroraService.getProbabilityByLatLng(result.entries,-45,0));
          callback();
        }).catch((err)=>{
      throw new Error(err)
    })

  })


});