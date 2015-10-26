"use strict";
import request from "request"
import {isDevMode} from "./../utils"
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
                            return (unixUtcTime - kpInformation.date) > 0

                        });

                resolve(nextKpInformation)

            }).catch(reject);
        })
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
                    .sort((a,b)=>a.distance - b.distance)
                    .pop();
                resolve(nextKpInformation.info)

            }).catch(reject);
        })

    }


}

