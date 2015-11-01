import request from "request"
import KpInformationExtened  from "./../../aurora-classes/KpInformationExtended"
import {unixToRFC3339Date}  from "./../../utils"
import moment from "moment"
import NodeCache from "node-cache"
export default class Kp3DayForecast{

    static get URL(){return "http://services.swpc.noaa.gov/text/3-day-forecast.txt"}

    static get wantedRows(){
        return [
            "00-03UT",
            "03-06UT",
            "06-09UT",
            "09-12UT",
            "12-15UT",
            "15-18UT",
            "18-21UT",
            "21-00UT"
        ]


    }

    constructor(){
        this.cache = new NodeCache();

    }
    parseRawData(rawData){
        let currentDate = moment.utc();
        currentDate.hours(0);
        currentDate.minutes(0);
        currentDate.seconds(0);

        /**
         * Example data:
         *
         *
         *
         * :Product: 3-Day Forecast
         :Issued: 2015 Oct 27 1230 UTC
         # Prepared by the U.S. Dept. of Commerce, NOAA, Space Weather Prediction Center
         #
         A. NOAA Geomagnetic Activity Observation and Forecast

         The greatest observed 3 hr Kp over the past 24 hours was 1 (below NOAA
         Scale levels).
         The greatest expected 3 hr Kp for Oct 27-Oct 29 2015 is 4 (below NOAA
         Scale levels).

         NOAA Kp index breakdown Oct 27-Oct 29 2015

         Oct 27     Oct 28     Oct 29
         00-03UT        0          3          3
         03-06UT        1          2          2
         06-09UT        1          2          2
         09-12UT        1          2          3
         12-15UT        1          2          3
         15-18UT        1          2          3
         18-21UT        1          2          3
         21-00UT        2          2          4

         Rationale: No G1 (Minor) or greater geomagnetic storms are expected.  No
         significant transient or recurrent solar wind features are forecast.


         * @type {Array}
         */

        let kpInformations = rawData.split("\n") // split to get an array
                                    .filter((line)=>{
                                        /**
                                         * Filter the line that match the wantedRows array
                                         *
                                         */
                                        let firstLetters = line.substr(0,Kp3DayForecast.wantedRows[0].length);
                                        return Kp3DayForecast.wantedRows.indexOf(firstLetters) > 0;
                                    }).map((row,i)=>{
                                            //Now we have only the rows that we want with the following format:
                                            /**
                                             *  00-03UT        0          3          3
                                             *  or:
                                             *  15-18UT        2          6 (G2)     5 (G1)
                                             * @type {number}
                                             */


                                            //get the hours and form from there an date
                                            let hours  = parseFloat(row.substr(0,2)) + 1.5;
                                            let currentDateHours = moment(currentDate).add(hours, "hours");

                                            //Split by spaces, filter all empty entries, and remove the 00-03UT values out of the arr
                                            //After this steps we have an array like [0,3,3]
                                            let data = row  .split(" ")
                                                            .filter((item)=>item.length != 0)
                                                            .slice(1)
                                                            .filter((item)=>item.length == 1)
                                                            .map((kpValue,index)=>{
                                                                //Now we can map all kp values in the array to an KPInformation instance


                                                                let kpInformation = new KpInformationExtened();

                                                                //get the utc by using the pre calculated currentDateHours and add there the days
                                                                kpInformation.utc = moment(currentDateHours).add(index,"days").unix();
                                                                kpInformation.date = unixToRFC3339Date(kpInformation.utc);
                                                                kpInformation.original = row;
                                                                kpInformation.kpValue = parseInt(kpValue);
                                                                return kpInformation;
                                                            });
                                            return data;

                                    });

        return [].concat.apply([],kpInformations); //Flattern array so make  [[ {}, {}],[{},{}]] => [{},{},{},{}]
    }


    getKpIndexForNextDays(){

        if(this.pendingPromie != undefined){
            return this.pendingPromie
        }
        this.pendingPromie =  new Promise((resolve,reject)=>{

            let cachedResult =   this.cache.get("result");
            if(cachedResult != undefined){
                console.log("getKpIndexForNextDays: Used cache")
                resolve(cachedResult)
                return;
            }
            request(Kp3DayForecast.URL,(err,request,body)=>{
                if(err){
                    reject(err);
                    return;
                }
                let kpInformations = this.parseRawData(body);
                this.cache.set("result",kpInformations,900000/2);
                resolve(kpInformations)

            })

        });
        return this.pendingPromie;
    }


}