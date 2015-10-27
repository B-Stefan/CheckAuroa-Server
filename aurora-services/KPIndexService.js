"use strict";
import request from "request"
import {isDevMode,unixToRFC3339Date} from "./../utils"
import moment from "moment";
import KpWingService from "./KpServices/KpWingService"
import Kp3DayForecast from "./KpServices/Kp3DayForecast"

/**
 * Service to get the kp values
 * @class KPIndexService
 *
 */
export default class KPIndexService {

    /**
     *
     * @constructor
     */
    constructor(){
        this.kpWingService =  new KpWingService();
        this.kp3DayService =  new Kp3DayForecast();

    }

    /**
     * Collect all kpInformation from different services and return a unsorted list of KpInformation
     * @method getKpList
     * @private
     * @returns {Promise<KpInformation[]>}
     */
    getKpList(){

        return new Promise((resolve,reject)=>{
            let kp3Days = this.kp3DayService.getKpIndexForNextDays();
            let kpWing = this.kpWingService.getList();

            Promise.all([kpWing,kp3Days]).then((data)=>{

                let flattern = [].concat.apply([],data);
                resolve(flattern);

            }).catch(reject)
        })
    }

    /**
     * Returns a list of kp information. All entires are after the param UTCDate
     * @method getKpListByUTCDate
     * @param UTCDate
     * @returns {Promise<KpInformation[]>}
     */
    getKpListByUTCDate(UTCDate){
        let unixUtcTime = UTCDate;

        return new Promise((resolve,reject)=>{

            //Get the list
            this.getKpList().then((list)=>{
                let nextKpInformation =
                    list.filter((kpInformation)=> {
                            return (kpInformation.utc - unixUtcTime) > 0

                        });

                resolve(nextKpInformation)

            }).catch(reject);
        })
    }
    /**
     * Returns the KPInformation that is the nearest to the param UTCDate
     * @method getKpByUTCDate
     * @param UTCDate
     * @returns {Promise.<KPInformation>}
     */
    getKpByUTCDate(UTCDate){

        return new Promise((resolve,reject)=>{

            let unixUtcTime = UTCDate;
            //Get the list
            this.getKpList().then((list)=>{
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

