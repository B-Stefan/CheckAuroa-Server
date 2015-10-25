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
        return {
            utcDate: req.swagger.params.UTCDateTime.value ? moment(req.swagger.params.UTCDateTime.value).unix(): moment().unix()
        }
    }
    getKpIndexList(req,res,next){

        const params = this.normalizeParams(req);

        this.kpService.getKpByUTCDate(params.utcDate).then((list)=>{
            res.json(list);
        }).catch((e)=>{
            res.status(501);
            res.json(e);
        });



    }
    getLastIndex(req,res,next){
        res.send("Yeees" )
    }

}