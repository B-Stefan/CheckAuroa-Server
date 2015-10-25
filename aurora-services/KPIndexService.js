"use strict";
import request from "request"
import {isDevMode} from "./../utils"
import moment from "moment";
import KpWingService from "./KpServices/KpWingService"

export default class KPIndexService {

    constructor(){
        this.kpWingService =  new KpWingService();

    }

    /**
     *
     * @param UTCDate
     * @returns {Promise.<T>}
     */
    getKpByUTCDate(UTCDate){
        let unixUtcTime = moment(UTCDate).utc().unix();

        return new Promise((resolve,reject)=>{

            //Get the list
            this.kpWingService.getList().then((list)=>{
                let nextKpInformation =
                    list.map((kpInformation)=> {
                            return {
                                distance: Math.abs(kpInformation.date - unixUtcTime),
                                info: kpInformation
                            }
                        })
                    .sort((a,b)=>b.distance - a.distance)
                    .pop();
                resolve(nextKpInformation.info)

            }).catch(reject);
        })

    }


}

