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
        return {
            lat: req.swagger.params.lat.value,
            lng: req.swagger.params.lng.value,
            utcDate: req.swagger.params.UTCDateTime.value ? moment(req.swagger.params.UTCDateTime.value).unix(): moment().unix()
        }
    }
    getRatings(req,res,next){

        const params = this.normalizeParams(req);

        this.raitingService.getRatings(params.lat, params.lng, params.utcDate).then((list)=>{
            res.josn(list);
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