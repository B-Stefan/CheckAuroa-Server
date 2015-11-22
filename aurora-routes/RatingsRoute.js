import {Error} from "./../aurora-api/clients/typescript-node-client/api.ts"
import moment from "moment"
import RatingsService from "./../aurora-services/RatingsService"

export default class RatingsRoute{

    static get URL(){return "/ratings"}

    static get URL_CURRENT(){return RatingsRoute.URL + "/current"}

    constructor(){
        this.raitingService = new RatingsService()
    }
    normalizeParams(req){
        let date;
        if(req.swagger.params.UTCDateTime.value == "now"){
            date = moment().utcOffset(0).unix()
        }else {

            //See https://github.com/moment/moment/issues/1407
            moment.createFromInputFallback = function(config) { config._d = new Date(config._i); };

            date = moment(req.swagger.params.UTCDateTime.value.replace(" ", "+")).utcOffset(0).unix()
        }

        return {
            lat: req.swagger.params.lat.value,
            lng: req.swagger.params.lng.value,
            utcDate: date
        }
    }
    getRatings(req,res,next){

        const params = this.normalizeParams(req);

        this.raitingService.getRatings(params.lat, params.lng, params.utcDate).then((list)=>{
            res.json(list);
        }).catch((e)=>{
            res.status(501);
            let error = new Error();
            res.json(error.message = e);
        });



    }
    getCurrentRating(req,res,next){
        const params = this.normalizeParams(req);
        this.raitingService.getNearestRatings(params.lat,params.lng,params.utcDate).then((item)=>{
            res.json(item);
        }).catch((e)=>{
            res.status(501);
            let error = new Error();
            res.json(error.message = e);
        });
    }
    getRating(req,res,next){

    }
}