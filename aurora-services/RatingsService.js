import KPService from "./KPIndexService"
import WeatherService from "./WeatherService"
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
	
	
	  options.returnValueAfterCalculation = returnValue
      console.log(JSON.stringify(options));
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
  getRatings(lng, lat, uTCDateTime){

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


}
