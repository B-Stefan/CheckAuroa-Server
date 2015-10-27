"use strict";
import request from "request"
import {isDevMode,unixToRFC3339Date} from "./../utils"
import moment from "moment";
import KpWingService from "./KpServices/KpWingService"
import Kp3DayForecast from "./KpServices/Kp3DayForecast"

export default class KPIndexService {

    constructor(){
        this.kpWingService =  new KpWingService();
        this.kp3DayService =  new Kp3DayForecast();

    }

    getKpList(){

        return new Promise((resolve,reject)=>{
            let kp3Days = this.kp3DayService.getKpIndexForNextDays();
            let kpWing = this.kpWingService.getList();

            console.log(kpWing,kp3Days)
            Promise.all([kpWing,kp3Days]).then((data)=>{

                let flattern = [].concat.apply([],data);
                console.log("RESOLVE",JSON.stringify(flattern,null,4));
                resolve(flattern);

            }).catch(reject)
        })
    }
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
     *
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

