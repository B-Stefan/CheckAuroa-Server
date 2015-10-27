import KPService from "./KPIndexService"
import GeomagnaticLocationService from "./GeomagnaticLocationService"
import {Rating} from "./../aurora-api/clients/typescript-node-client/api.ts"
import {unixToRFC3339Date} from "./../utils"
import moment from "moment"
/**
 *
 * This class provide functions to get a mixed rating from weather, location, datetime and kp index
 *
 * @class RatingsService
 */
export default class RatingsService{


  /**
   * Set up the required sub-services
   * @constructor
   */
  constructor(){
    this.geoService = new GeomagnaticLocationService();
    this.kpService = new KPService()
  }

  /**
   *
   * Calculate the rating value and returns the value.
   * In this function all magic happend
   * @param kpInformation
   * @param weatherInformation
   * @param location
   * @param utcDateTime
   * @returns double
     */
  calculateRating(kpInformation, weatherInformation, location, utcDateTime){

  }

  /**
   * Returns a list of ratings for the next 24 hours
   * @param lng
   * @param lat
   * @param uTCDateTime
   * @returns {Promise<Ratings[]>}
     */
  getRatings(lng, lat, uTCDateTime){

    let kpIndexPromise = this.kpService.getKpByUTCDate(uTCDateTime);

    let geoPromise = this.geoService.transformToGeomagnetic(lat,lng);

    return new Promise((resolve,reject)=>{
      Promise.all([kpIndexPromise,geoPromise]).then((data)=> {
        console.log("FINISHED");

        let geoInformation = data.pop();
        let kpInformation = data.pop();


        let ratingsPromises = Array.from(Array(12).keys()).map((NullData, i)=>{


          let currentDate;
          if(i < 5 ){
            currentDate = moment.unix(uTCDateTime).utcOffset(0).add(i,"hour").unix();
          }else {
            currentDate = moment.unix(uTCDateTime).utcOffset(0).add(i + (i-4)*2,"hour").unix();
          }
          let info = {
            utc: currentDate,
            kpPromise: this.kpService.getKpByUTCDate(currentDate)
          };
          return info;
        });

        Promise.all(ratingsPromises.map((info)=>info.kpPromise)).then((resultData)=>{

          let ratings = resultData.map((kpInformation,i)=>{

            let originalUTC = ratingsPromises[i].utc;
            let newRating = new Rating();
            newRating.utc = originalUTC;
            newRating.date = unixToRFC3339Date(newRating.utc);
            newRating.kp = kpInformation;
            return newRating;
          });

          resolve(ratings)

        }).catch(reject);

      }).catch((err)=>{
        console.log(err);
        reject(err);
      })
    })





  }


}
