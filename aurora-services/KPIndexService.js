"use strict";
import request from "request"
import {isDevMode,unixToRFC3339Date} from "./../utils"
import moment from "moment";
import KpWingService from "./KpServices/KpWingService"

export default class KPIndexService {

    constructor(){
        this.kpWingService =  new KpWingService();

    }

    getKpListByUTCDate(UTCDate){
        let unixUtcTime = UTCDate;

        return new Promise((resolve,reject)=>{

            //Get the list
            this.kpWingService.getList().then((list)=>{
                let nextKpInformation =
                    list.filter((kpInformation)=> {
                            return (kpInformation.utc - unixUtcTime) > 0

                        });

                resolve(nextKpInformation)

            }).catch(reject);
        })
    }
    /**
     *
     * @param UTCDate
     * @returns {Promise.<KPInformation>}
     */
    getKpByUTCDate(UTCDate){

        return new Promise((resolve,reject)=>{

            let unixUtcTime = UTCDate;
            //Get the list
            this.kpWingService.getList().then((list)=>{
                let nextKpInformation =
                    list.map((kpInformation)=> {
                            return {
                                distance: Math.abs(kpInformation.utc - unixUtcTime),
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

