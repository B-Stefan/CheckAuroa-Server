import moment from "moment"
import {findNextKPIndexForUTC, unixToRFC3339Date} from "./../../server/utils"
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


};
