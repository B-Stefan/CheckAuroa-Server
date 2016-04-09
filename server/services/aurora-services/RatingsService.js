import KPService from "./KPIndexService"
import GeomagnaticLocationService from "./GeomagnaticLocationService"
import {unixToRFC3339Date} from "./../../utils"
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
   * @class RatingsService
   */
  constructor(){
    this.geoService = new GeomagnaticLocationService();
    this.kpService = new KPService();
    this.weatherService = new WeatherService()
  }

  /**
   *
   * Calculate the rating value and returns the value.
   * In this function all magic happend
   * @method calculateRating
   * @class RatingsService
   * @param {KpInformation} kpInformation
   * @param  geomagnaticLocation
   * @param {WeatherInformation} weatherInformation
   * @param {Location} location
   * @param {int} utcDateTime
   * @returns double
     */
  calculateRating(kpInformation,geomagnaticLocation, weatherInformation, location, utcDateTime){


      //return Math.random();

      let kpIndex = kpInformation.kpValue;// kpIndex value from 0-9, 9 = highest
      let cloudCover = weatherInformation.cloudCover; // CloudCover value from 0-1, 1 = most cloudy
      let magneticLatitude = geomagnaticLocation.latG;// value from -90 - 90 representing mag. latitude in degrees
      let currentTime = utcDateTime;			// timestamp of forecasttime in Unix timestamp format (?)
      let sunRise =  weatherInformation.sunriseTime; 				// timestamp of sunrise of forecastday in Unix timestamp format
      let sunSet = weatherInformation.sunsetTime;				// timestamp of sunset of forecastday in Unix timestamp format

      let options = {
        kpIndex: kpIndex,
        cloudCover: cloudCover,
        magneticLatitude: magneticLatitude,
        currentTime: currentTime,
        sunRise: sunRise,
        sunSet: sunSet

      };
      let returnValue;

      /**
       * Sunrise / Sunset calculation
       */

      let SunriseSetPercent;
      //If no sunset/sunrise
      if(sunRise == null ||sunSet == null){

          SunriseSetPercent = 1;
      }
      //If no sunset/sunrise
      else if(sunSet + sunRise == 0){
          SunriseSetPercent = 1;
      }
      //After sunset begins !!!
      else if(currentTime > sunSet ){
          SunriseSetPercent = 1;
          var sunsetDistance = Math.abs(currentTime - sunSet);
          var cal =  Math.round((1- (sunsetDistance / 1000) )* 100)/100;
          if(cal > 0 ){
              SunriseSetPercent =cal
          }

      }
      //before sunrise begins
      else if (currentTime < sunRise){
          SunriseSetPercent =  1;
      }
      //No sunset and no sunrise you are in the middle of the day
      else {
          var sunriseDistance = Math.abs(currentTime - sunRise);
          var cal =  Math.round((1- (sunriseDistance / 1000) )* 100)/100;
          SunriseSetPercent =0;
          if(cal > 0 ){
            SunriseSetPercent =cal
          }
      }
      /**
       * Weather calculation
       */
      let WeatherPercent = 0;

      if(cloudCover >= .8){
          WeatherPercent = 1-.8;
      }
      else if(cloudCover >= .6){
          WeatherPercent = 1-.45;
      }
      else if(cloudCover >= .4){
          WeatherPercent = 1-.2;
      }
      else WeatherPercent = 1;

      /**
       * KP Index
       * @type {number}
       */
      var requiredKPIndex = (((magneticLatitude - 68.567) / -2.0485) -1) ;

      var kpDistance = requiredKPIndex - kpIndex
      console.log(magneticLatitude,kpDistance,kpIndex)
      let kpPercent;
      if(kpDistance < 0){
          kpPercent = 0.8 ;
          if(kpDistance < -1){
              kpPercent = kpPercent + 0.2;
          }

      }else if(kpDistance < 0.5){
          kpPercent = 0.3;
      }else if(kpDistance < 1){
          kpPercent = 0.2;
      }else{
          kpPercent = 0;
      }
      if(SunriseSetPercent == 0 ){
          returnValue = 0
      }else {
          returnValue = (kpPercent*4 + SunriseSetPercent + WeatherPercent/2)/6;
      }
      console.log("=======================================");
      console.log("Date:",unixToRFC3339Date(currentTime));
      console.log("SunriseSetPercent:",SunriseSetPercent);
      console.log("WeatherPercent",WeatherPercent);
      console.log("kpPercent",kpPercent);
      console.log("returnValue",returnValue);
      console.log("=======================================");
      /*
      if(currentTime > sunSet  || currentTime < sunRise && cloudCover <= .9){
			{


				if(((magneticLatitude - 68.567) / -2.0485) -1 >= (kpIndex)){
					returnValue = 0;						// if kp-index is less then zone number, you can stay home.
				} else {

					// 0-40% Cloudcover doesn't affect visibility, 40-60% substracts 20% chance, 60-80% substracts 45%, 80-90% substracts 80%
					// when kp-Index is way larger then the zonenumber (i.e. +2, sounds somewhat realistic -- check this later)

					console.log(((magneticLatitude - 68.567) / -2.0485) - 1);

					if(((magneticLatitude - 68.567) / -2.0485) <= (kpIndex)){
						if(cloudCover >= .8){
							returnValue = 1-.8;
						}
						else if(cloudCover >= .6){
							returnValue = 1-.45;
						}
						else if(cloudCover >= .4){
							returnValue = 1-.2;
						}
						else returnValue = 1;
					}
					else {

						if(cloudCover >= .85){
							returnValue = .05;
						}
						else if(cloudCover >= .8){
							returnValue = .1;
						}
						else if(cloudCover >= .6){
							returnValue = .5-.3;
						}
						else if(cloudCover >= .4){
							returnValue = .5-.2;
						}
						else returnValue = .5;
					}
				}
			}
		}
		else returnValue = 0; // returns 0 if daytime and/or it's too cloudy
*/

      //console.log(JSON.stringify(options));
      return returnValue;
}

  /**
   * Returns a list of ratings for the next 24 hours
   * @method getRatings
   * @class RatingsService
   * @param {double} lng
   * @param {double} lat
   * @param {int} uTCDateTime
   * @returns {Promise<Ratings[]>}
     */
  getRatings(lat,lng, uTCDateTime){

    let geoPromise = this.geoService.transformToGeomagnetic(lat,lng);

    let weatherPromise = this.weatherService.getWeatherPredictionByLatLng(lat,lng,uTCDateTime);

    let location = new Location();
    location.lat = lat;
    location.lng = lng;

    let self = this;

    return new Promise((resolve,reject)=>{
      Promise.all([weatherPromise,geoPromise]).then((data)=> {

        let geomagnaticLocation = data.pop();
        let weatherInfos = data.pop();

        let ratingsPromises = Array.from(Array(12).keys()).map((NullData, i)=>{

          return new Promise((resolve, reject)=>{

            let currentDate;

            if(i < 5 ){
              currentDate = moment.unix(uTCDateTime).utcOffset(0).add(i,"hour").unix();
            }else {
              currentDate = moment.unix(uTCDateTime).utcOffset(0).add(i + (i-4)*2,"hour").unix();
            }

            this.kpService.getKpByUTCDate(currentDate).then((kpInformation)=>{
              let newRating = new Rating();
              newRating.utc = currentDate;
              newRating.date = unixToRFC3339Date(newRating.utc);
              newRating.kp = kpInformation;
              newRating.weather = this.weatherService.getNearestWeatherInformation(newRating.utc,weatherInfos);
              newRating.value = this.calculateRating(newRating.kp,geomagnaticLocation,newRating.weather,location, newRating.utc);

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
  getNearestRatings(lat,lng,utcDate){

    return new Promise((resolve,reject)=>{

      this.getRatings(lat,lng,utcDate).then((ratings)=>{

        let item =  ratings.sort((a,b)=>{
          return Math.abs(utcDate-a.utc) < Math.abs(utcDate-b.utc)
        }).pop();

        resolve(item)

      }).catch(reject)
    })
  }


}
