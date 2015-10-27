import KPService from "./KPIndexService"
import GeomagnaticLocationService from "./GeomagnaticLocationService"
import {Rating, Location,GeomagnaticLocation} from "./../aurora-api/clients/typescript-node-client/api.ts"
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

    return 0.0;
  }

  /**
   * Returns a list of ratings for the next 24 hours
   * @param lng
   * @param lat
   * @param uTCDateTime
   * @returns {Promise<Ratings[]>}
     */
  getRatings(lng, lat, uTCDateTime){

    let geoPromise = this.geoService.transformToGeomagnetic(lat,lng);

    let location = new Location();
    location.lat = lat;
    location.lng = lng;

    let self = this;

    return new Promise((resolve,reject)=>{
      Promise.all([geoPromise]).then((data)=> {

        let geomagnaticLocation = data.pop();

        let ratingsPromises = Array.from(Array(12).keys()).map((NullData, i)=>{

          return new Promise((resolve, reject)=>{

            let currentDate;

            if(i < 5 ){
              currentDate = moment.unix(uTCDateTime).utcOffset(0).add(i,"hour").unix();
            }else {
              currentDate = moment.unix(uTCDateTime).utcOffset(0).add(i + (i-4)*2,"hour").unix();
            }
            console.log(currentDate);

            this.kpService.getKpByUTCDate(currentDate).then((kpInformation)=>{
              let newRating = new Rating();
              newRating.utc = currentDate;
              newRating.date = unixToRFC3339Date(newRating.utc);
              newRating.kp = kpInformation;
              newRating.value = this.calculateRating(newRating.kp,geomagnaticLocation,location, newRating.utc);

              resolve(newRating)

            }).catch(reject);

          });
        });

        Promise.all(ratingsPromises).then((resultData)=>{

          resolve(resultData);

        }).catch(reject);

      }).catch(reject)
    })





  }


}
