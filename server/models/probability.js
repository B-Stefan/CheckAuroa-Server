import moment from "moment"
import NowCastAuroraService from "./../aurora-services/NowCastAuroraService"

module.exports = function(Probability) {
  
  Probability.disableRemoteMethod("exists", true);
  Probability.disableRemoteMethod("deleteById", true);
  Probability.disableRemoteMethod("delete", true);
  Probability.disableRemoteMethod("findById", true);
  Probability.disableRemoteMethod("update", true);
  Probability.disableRemoteMethod("updateAttributes", false);
  Probability.disableRemoteMethod("updateAll", true);
  Probability.disableRemoteMethod("create", true);
  Probability.disableRemoteMethod("createChangeStream", true);
  Probability.disableRemoteMethod("upsert", true);


  Probability.current = function (lat,lng,cb) {
    console.time("NowCastGet");
    let currentDate = moment().utc().utcOffset(0);

    let min = currentDate.add(-5, "minutes").unix();
    let max = currentDate.add(5, "minutes").unix();

    Probability.app.models.AuroraNowcast.findOne({
      where: {
        id: {between: [min, max]}
      }
    }, (err, result)=> {

      let currentProbability = NowCastAuroraService.getProbabilityByLatLng(JSON.parse(result.entries),lat,lng)
      console.timeEnd("NowCastGet");
      cb(err, {
        validAt: result.validAt,
        createdAt: result.createdAt,
        probability: currentProbability
      });
    });
  };
  Probability.remoteMethod(
      'current',
      {
        accepts: [{arg: 'lat', type: 'number'},
                  {arg: 'lng', type: 'number'}],
        http: {path: '/current', verb: 'get'},
        returns: {arg: 'current', type: "object", root: true}
      }
  );

};
