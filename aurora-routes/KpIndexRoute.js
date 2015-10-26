import {Error} from "./../aurora-api/clients/typescript-node-client/api.ts"
import moment from "moment"
import KPIndexService from "./../aurora-services/KPIndexService"
export default class KpIndexRoute{

    static get URL(){return "/kpIndex"}

    static get URL_LAST_RATING(){return KpIndexRoute.URL + "/last"}

    constructor(){
        this.kpService = new KPIndexService()
    }
    normalizeParams(req){

        let date;
        if(req.swagger.params.UTCDateTime.value == "now"){
            date = moment().utcOffset(0).unix()
        }else {
            date = moment(req.swagger.params.UTCDateTime.value).utcOffset(0).unix()
        }
        return {
            utcDate: date
        }
    }
    getKpIndexList(req,res,next){

        const params = this.normalizeParams(req);

        this.kpService.getKpListByUTCDate(params.utcDate).then((list)=>{
            res.json(list);
        }).catch((e)=>{
            res.status(501);
            res.json(e);
        });



    }
    getLastIndex(req,res,next){
        const params = this.normalizeParams(req);

        this.kpService.getKpByUTCDate(params.utcDate).then((list)=>{
            res.json(list);
        }).catch((e)=>{
            res.status(501);
            res.json(e);
        });
    }

}