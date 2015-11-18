import {Error} from "./../aurora-api/clients/typescript-node-client/api.ts"
import moment from "moment"
import WeatherService from "./../aurora-services/WeatherService"
export default class WeatherRoute{

    static get URL(){return "/weather"}

    static get URL_CURRENT(){return "/weather/current"}

    constructor(){
        this.weatherService = new WeatherService()
    }
    normalizeParams(req){
        let date;
        if(req.swagger.params.UTCDateTime.value == "now"){
            date = moment().utcOffset(0).unix()
        }else {
            date = moment(req.swagger.params.UTCDateTime.value).utcOffset(0).unix()
        }

        return {
            lat: req.swagger.params.lat.value,
            lng: req.swagger.params.lng.value,
            utcDate: date
        }
    }
    getWeatherPrediction(req,res,next){

        const params = this.normalizeParams(req);

        this.weatherService.getWeatherPredictionByLatLng(params.lat, params.lng, params.utcDate).then((list)=>{
            res.json(list);
        }).catch((e)=>{
            res.status(501);
            res.json(e);
        });



    }
    getCurrentWeather(req,res,next){
        const params = this.normalizeParams(req);

        this.weatherService.getNearestWeatherInformationByLatLng(params.lat, params.lng, params.utcDate).then((entry)=>{
            res.json(entry);
        }).catch((e)=>{
            res.status(501);
            res.html(e);
        });
    }
}