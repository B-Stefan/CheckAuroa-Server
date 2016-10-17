import moment from "moment"
import NowCastAuroraService from "./../services/aurora-services/NowCastAuroraService"
import PredictionServiceDatabase from "./../services/PredictionServiceDatabase"
import SuncalcService from "./../services/SuncalcService"
import pmx from "pmx"
var probe = pmx.probe();

var counter = probe.counter({
  name : 'Prediction req processed'
});

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
  

  Probability.prediction= function (date,lat,lng,cb) {
    const predictionService = new PredictionServiceDatabase(Probability.app);

    const sunCalcService = new SuncalcService();

    counter.inc()

    //Get prediction and warp result with the location 
    return Promise.all(predictionService.get24HourPrediction(date,lat,lng,null)).then((results)=>{
      let list = results.map((item)=>{
        item.location = {lat: lat, lng:lng};
        return item;
      });

      let sunInformation = sunCalcService.getSunInformation(date,lat,lng);
      let sunInformationNextDay = sunCalcService.getSunInformation(moment(date).add(1,"days"),lat,lng);
      let sunrise = sunInformationNextDay.sunriseEnd;
      let sunset = sunInformation.sunset;


      if(list == null || typeof  list == "undefined"){
        list = [];
      }
      let max = list.slice().filter((item)=>moment(item.date).isBetween(moment(sunset),moment(sunrise))).sort((a,b)=>a.probability - b.probability);
      return {
        sunrise: sunrise,
        sunset: sunset,
        max: max.pop(),
        min: max.reverse().pop(),
        hours:list.sort((a,b)=>a.date.unix() - b.date.unix())
      }
    })
  };

  //cast datetime to date
  Probability.beforeRemote("prediction", function( ctx,model, next){
    let date = moment(ctx.req.query.date).utc().format("YYYY-MM-DD");
    ctx.req.query.date = date;
    next()
  });

  Probability.modelBuilder.define("ProbabilityConclusion", {
    sunrise: Date,
    sunset: Date,
    max: "Probability",
    min: "Probability",
    hours: ["Probability"]

  });


  Probability.remoteMethod(
      'prediction',
      {
        accepts: [
          {
            arg: 'date', 
            type: 'date',
            http: function(ctx) {
              // ctx is LoopBack Context object

              // 1. Get the HTTP request object as provided by Express
              var req = ctx.req;

              return moment(req.param('date'))
            }


          },
          {arg: 'lat', type: 'number'},
          {arg: 'lng', type: 'number'},

        ],
        http: {path: '/prediction', verb: 'get'},
        returns: {arg: 'prediction', type: "ProbabilityConclusion", root: true}
      }
  );

  Probability.current = function (lat,lng,cb) {
    console.time("NowCastGet");
    let currentDate = moment().utc().utcOffset(0);

    counter.inc()

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
