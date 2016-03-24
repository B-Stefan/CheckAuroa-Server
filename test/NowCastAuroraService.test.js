require("babel-register")({
  "presets": ["es2015", "stage-0"]
});
var NowCastAuroraService  = require("./../server/aurora-services/NowCastAuroraService").default;
var assert = require('assert');

describe('NowCastAuroraService', function() {

  this.timeout(100000);

  it("should response a list of nowcast ", function (callback) {
    new NowCastAuroraService()
        .getList()
        .then(function (result) {
          assert.equal(result.entires.length,NowCastAuroraService.rowCountExpected * NowCastAuroraService.colCountExpected);
          callback();
        })

  })
  

});