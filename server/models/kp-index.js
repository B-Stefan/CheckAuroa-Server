import moment from "moment"
import {findNextKPIndexForUTC, unixToRFC3339Date} from "./../../server/utils"
import KpIndexDailyPrediction from "./../services/aurora-services/KpIndexPredictionService"
import {ModelBuilder} from "loopback-datasource-juggler"

module.exports = function (KpIndex) {
  /*
   KpIndex.observe('access', function(ctx, next) {
   next()

   });
   KpIndex.sharedClass.methods().forEach((method)=>{

   console.log(method.name, method.isStatic);

   });
   */


  KpIndex.disableRemoteMethod("exists", true);
  KpIndex.disableRemoteMethod("deleteById", true);
  KpIndex.disableRemoteMethod("delete", true);
  KpIndex.disableRemoteMethod("findById", true);
  KpIndex.disableRemoteMethod("update", true);
  KpIndex.disableRemoteMethod("updateAttributes", false);
  KpIndex.disableRemoteMethod("updateAll", true);
  KpIndex.disableRemoteMethod("create", true);
  KpIndex.disableRemoteMethod("createChangeStream", true);
  KpIndex.disableRemoteMethod("upsert", true);

  KpIndex.current = function (cb) {
    let currentDate = moment().utc().utcOffset(0);

    let min = currentDate.add(-1, "days").unix();
    let max = currentDate.add(1, "days").unix();

    KpIndex.find({
      where: {
        utc: {between: [min, max]}
      }
    }, (err, results)=> {
      let result = findNextKPIndexForUTC(currentDate.unix(), results);
      cb(err, result);
    });
  };
  KpIndex.remoteMethod(
      'current',
      {
        http: {path: '/current', verb: 'get'},
        returns: {arg: 'current', type: "KpIndex", root: true}
      }
  );


  KpIndex.prediction = function (cb) {
    let currentDate = moment().utc().utcOffset(0).unix();

    KpIndex.find({
      where: {
        utc: {gt: currentDate}
      }
    }, cb);
  };
  KpIndex.remoteMethod(
      'prediction',
      {
        http: {path: '/prediction', verb: 'get'},
        returns: {
          arg: 'items',
          root: true,
          type: ["KpIndex"]
        }
      }
  );




  KpIndex.modelBuilder.define("KpIndexDayPrediction", {
    date: Date,
    min: "KpIndex",
    max: "KpIndex"
  });

  KpIndex.prediction3Days = function (cb) {
    //12am of the current day
    let currentDate = moment().utc().utcOffset(0).startOf("day").add(12,"hours").unix();

    KpIndex.find({
      where: {
        utc: {gt: currentDate}
      }
    }, (err, items)=>{
      let predictionClass = new KpIndexDailyPrediction(items);

      let result = predictionClass.get3DaysPrediction();

      cb(err, result)
    });
  };
  KpIndex.remoteMethod(
      'prediction3Days',
      {
        http: {path: '/prediction/daily', verb: 'get'},
        returns: {
          arg: 'items',
          root: true,
          type: ["KpIndexDayPrediction"]
        }
      }
  );


};
