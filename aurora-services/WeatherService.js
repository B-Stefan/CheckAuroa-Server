import request from "request"
import Forecast  from "forecast.io-bluebird";
import {WeatherInformation, Location} from "./../aurora-api/clients/typescript-node-client/api.ts"
import NodeCache from "node-cache";
import {unixToRFC3339Date} from  "./../utils"
export default class WeatherService{


    static get WEATHER_API_URL(){return  "https://api.forecast.io/forecast"}
    static get WEATHER_API_API_KEY (){return "d4cfe2f9f73fda7e6965e25c47a06f1d"}


    constructor(){
        this.forecastAPI = new Forecast({
            key: WeatherService.WEATHER_API_API_KEY,
            timeout: 2500
        });
        this.cache = new NodeCache();
    }
    getNearestWeatherInformation(utcDate, weatherInformation){

        let list =  weatherInformation.sort((a,b)=>{
            return Math.abs(utcDate-a.utc) < Math.abs(utcDate-b.utc)
        }).pop();
        return list

    }
    getNearestWeatherInformationByLatLng(lat,lng,utcDate){

        return new Promise((resolve,reject)=>{
            this.getWeatherPredictionByLatLng(lat,lng,utcDate).then((list)=>{
                resolve(this.getNearestWeatherInformation(utcDate,list))
            }).catch((e)=>{
                console.log(e)
            })
        });
    }
    getWeatherPredictionByLatLng(lat,lng,utcDate){
        let location = new Location();
        location.lat = lat;
        location.lng = lng;
        return this.getWeatherPrediction(location,utcDate);
    }

    getWeatherPrediction(location, utcDate){
      return new Promise((resolve,reject)=>{
            let cache = this.cache.get(location.lat + location.lng + utcDate);
            if(cache != undefined){
                console.log("CACHE!!!");
                resolve(cache);
                return;
            }

            const options = {
                units: 'si',
                exclude: 'minitely,alerts,flags',
                lang: 'en'
            };



            this.forecastAPI.fetch(location.lat, location.lng, unixToRFC3339Date(utcDate), options)
                .then((result) =>{

                    let today = result.daily.data.reverse().pop();
                    let sunriseTime = today.sunriseTime;
                    let sunsetTime = today.sunsetTime;


                    let results = result.hourly.data.map((forecast)=>{
                        let newInfo = new WeatherInformation();
                        newInfo.summary =  forecast.summary;
                        newInfo.utc =  forecast.time;
                        newInfo.date =  unixToRFC3339Date(forecast.time);
                        newInfo.cloudCover =  forecast.cloudCover;
                        newInfo.icon =  forecast.icon;
                        newInfo.sunriseTime = sunriseTime;
                        newInfo.sunsetTime = sunsetTime;
                        return newInfo;
                    });
                    this.cache.set(location.lat + location.lng + utcDate,results);
                    resolve(results);



                }).catch(reject);
        });
    }
}