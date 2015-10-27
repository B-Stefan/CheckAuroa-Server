import {Error} from "./../aurora-api/clients/typescript-node-client/api.ts"
import moment from "moment"
import RatingsService from "./../aurora-services/RatingsService"
export default class RatingsRoute{

    static get URL(){return "/ratings"}

    static get URL_LAST_RATING(){return RatingsRoute.URL + "/last"}

    constructor(){
        this.raitingService = new RatingsService()
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
    getRatings(req,res,next){

        const params = this.normalizeParams(req);

        this.raitingService.getRatings(params.lat, params.lng, params.utcDate).then((list)=>{
            res.json(list);
        }).catch((e)=>{
            res.status(501);
            res.json(e);
        });



    }
    getLastRating(req,res,next){
        res.send("Yeees" )
    }
    getRating(req,res,next){

    }
}