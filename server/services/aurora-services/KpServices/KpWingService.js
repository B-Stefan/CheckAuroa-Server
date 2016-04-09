"use strict";
import request from "request"
import {isDevMode,unixToRFC3339Date} from "./../../../utils"
import moment from "moment";
import {KpInformation} from "./../KPIndexService"
import NodeCache from "node-cache"
/**
 * Class for one row of the text file
 */
class Row{

    
    static getUTCDateFromRowARR(startIndex, row){
        let date =  moment.utc(
            {
                years: row[startIndex + 0],
                months: row[startIndex + 1]-1,
                date: row[startIndex + 2],
                hours: row[startIndex + 3].substr(0, 2),
                minutes: row[startIndex + 3].substr(2, 2),
            }
        );
        return date.unix()
    }
    static isValidRow(rowArr){

        if(rowArr.length == Object.keys(Row.COLLUMS).length){
            if(rowArr[Row.COLLUMS.PREDICTION_4_HOURS_KP_INDEX] != -1){
                return true;
            }
        }
        return false;
    }
    /**
     * Enum for the collums
     * @returns {{CREATED_AT_YEAR: number, CREATED_AT_MONTH: number, CREATED_AT_DAY: number, CREATED_AT_TIME: number, PREDICTION_4_HOURS_YEAR: number, PREDICTION_4_HOURS_MONTH: number, PREDICTION_4_HOURS_DAY: number, PREDICTION_4_HOURS_TIME: number, PREDICTION_4_HOURS_KP_INDEX: number, PREDICTION_8_HOURS_YEAR: number, PREDICTION_8_HOURS_MONTH: number, PREDICTION_8_HOURS_DAY: number, PREDICTION_8_HOURS_TIME: number, PREDICTION_8_HOURS_KP_INDEX: number}}
     * @constructor
     */
    static get COLLUMS(){
        return {
            "CREATED_AT_YEAR": 0,
            "CREATED_AT_MONTH": 1,
            "CREATED_AT_DAY": 2,
            "CREATED_AT_TIME": 3,

            "PREDICTION_4_HOURS_YEAR": 4,
            "PREDICTION_4_HOURS_MONTH": 5,
            "PREDICTION_4_HOURS_DAY": 6,
            "PREDICTION_4_HOURS_TIME": 7,
            "PREDICTION_4_HOURS_KP_INDEX": 8,

            "PREDICTION_8_HOURS_YEAR": 9,
            "PREDICTION_8_HOURS_MONTH": 10,
            "PREDICTION_8_HOURS_DAY": 11,
            "PREDICTION_8_HOURS_TIME": 12,
            "PREDICTION_8_HOURS_KP_INDEX": 13,
            "USAF_EST_KP": 14,

        }
    }
    constructor(rowValues){

        /**
         *  Row came in this format
         * [ '2015', => createdAt - year
         '10',  => createdAt - month
         '21',  => createdAt - day
         '0715', => createdAt - time (UTC!!)
         '2015', => 4HourPrediction date -> year
         '10', => 4HourPrediction date -> month
         '21', => 4HourPrediction  date -> day
         '0821', => => 4Hour prediction date -> time (UTC)
         '1.67', => 4hour prediction KP-INDEX
         '2015',=> 8HourPrediction -> year
         '10', => 8HourPrediction -> month
         '21',=> 8HourPrediction -> day
         '1121',=> 8HourPrediction -> time (UTC)
         '1.33', => 8HourPrediction -> KP-Index
         '2.33' ]
         *
         *
         *
         *
         * @param rowValues
         */


        /**
         *
         * @type {Date}
         *
         *
         * Date.UTC(year, month[, day[, hour[, minute[, second[, millisecond]]]]])
         */
        this.prediction1Hours = new KpInformation();
        this.prediction4Hours = new KpInformation();

        //Set up dates
        this.prediction1Hours.utc  = Row.getUTCDateFromRowARR(Row.COLLUMS.PREDICTION_4_HOURS_YEAR,rowValues);
        this.prediction1Hours.date = unixToRFC3339Date(this.prediction1Hours.utc);


        this.prediction4Hours.utc  = Row.getUTCDateFromRowARR(Row.COLLUMS.PREDICTION_8_HOURS_YEAR,rowValues);
        this.prediction4Hours.date = unixToRFC3339Date(this.prediction4Hours.utc);

        this.createdAt              = Row.getUTCDateFromRowARR(Row.COLLUMS.CREATED_AT_YEAR,rowValues);


        //Set up Kp-Values
        this.prediction1Hours.kpValue = parseFloat(rowValues[Row.COLLUMS.PREDICTION_4_HOURS_KP_INDEX]);
        this.prediction4Hours.kpValue = parseFloat(rowValues[Row.COLLUMS.PREDICTION_8_HOURS_KP_INDEX]);


        this.prediction1Hours.original = rowValues.join(";");
        this.prediction4Hours.original = rowValues.join(";");


        this.originalData = rowValues.join(";").toString();

    }
    originalData;
    createdAt;
    prediction1Hours;
    prediction4Hours;
}

/**
 * Service class to get and parse the wing-kp.txt
 */
export default class KpWingService {
    /**
     * URL for the text file
     * @returns {string}
     *
     */
    static get KP_API_URL() {
        return 'http://services.swpc.noaa.gov/text/wing-kp.txt'
    }


    constructor(){
        this.cache = new NodeCache()
    }

    /**
     * Retun a sorted list of
     * @param callback: (listSorted: Array<KpInformation> )=>void
     *
     */
    getList(){

        //Get the KP file and parse the raw file so you have for each row of the text file one row in the arr
        return new Promise((resolve, reject)=>{
            this.getKpIndexFile().then((results)=>{

                //Sort the results so the last prediction is the first entry
                let sorted = results.sort((a,b)=>{
                    return a.createdAt-b.createdAt
                });

                // create a new arr with the predictions of 1 hour
                let kpInformationArr = sorted.map((row)=>{
                    return new KpInformation(row.prediction1Hours);
                });

                //Add to the list the last 12 entries and form this entries the 4 hour prediction (12 because there is every 15 minutes a news row so 12/4 = 4h)
                let last12Predictions  = sorted.slice(sorted.length-12,sorted.length);
                last12Predictions.forEach((row)=>{

                    let info = new KpInformation(row.prediction4Hours);

                    kpInformationArr.push(info);
                });


                resolve(kpInformationArr);
            }).catch(reject)
        })


    }

    /**
     * This function take the raw data from the sattelite and parse this data into a readable array
     *
     * @param rawData
     */
    parseKPRawFile(rawData) {

        /**
         * Split the raw data into a line array (for each line one entry)
         * @type {Array<String>}
         */
        let lineArr = rawData.split("\n")
        /**
         * The index where the header ends
         * @type {number}
         */
        let startIndex = lineArr.indexOf("#---------------------------------------------------------------------------------------");
        /**
         * Get the header information and remove this lines form the lineArr.
         * @type {Array<String>}
         */
        let lineValues = lineArr.slice(startIndex+1,lineArr.length);



        if(isDevMode()){
            /*
             console.log("startIndex: ", startIndex)
             console.log("lineArr: ", lineArr)
             console.log("lineValues: ", lineValues)
             */
        }


        /**
         * Results
         * @type {Array<Row>}
         */
        let results = new Array();
        /**
         * Loop for each row with the data
         */
        lineValues.forEach((row)=> {

            /**
             * Split by space and remove all space entries from array. After this step there is is a array of values
             *
             *
             * [ '2015', => createdAt - year
             '10',  => createdAt - month
             '21',  => createdAt - day
             '0715', => createdAt - time (UTC!!)
             '2015', => 4HourPrediction date -> year
             '10', => 4HourPrediction date -> month
             '21', => 4HourPrediction  date -> day
             '0821', => => 4Hour prediction date -> time (UTC)
             '1.67', => 4hour prediction KP-INDEX
             '2015',=> 8HourPrediction -> year
             '10', => 8HourPrediction -> month
             '21',=> 8HourPrediction -> day
             '1121',=> 8HourPrediction -> time (UTC)
             '1.33', => 8HourPrediction -> KP-Index
             '2.33' ]
             *
             * @type {Array.<T>}
             */
            let rowValues = row.split(' ').filter((cell)=>cell != " " && cell != '')
            if(Row.isValidRow(rowValues)){

                let newRow = new Row(rowValues);
                results.push(newRow)
            }else {
                console.log(JSON.stringify(rowValues))
            }

        });

        return results;

    }

    /**
     * Get the kp file from the server
     *
     *
     */
    getKpIndexFile() {

        if(this.pendingPromise != undefined){
            return this.pendingPromise;
        }
        this.pendingPromise  = new Promise((resolve,reject)=>{

            let cachedResult = this.cache.get("result");
            if(cachedResult == undefined){
                request(KpWingService.KP_API_URL, (error, response, body) => {
                    this.pendingPromise = undefined;
                    if (!error && response.statusCode == 200) {
                        let results = this.parseKPRawFile(body);
                        //this.cache.set("result", results, 10000);
                        resolve(results)
                    }else {
                        reject({
                            err: error,
                            response: response
                        })
                    }
                })
            }else{
                console.log("getKpIndexFile: resolved with cache");
                resolve(cachedResult)
            }


        });



        return this.pendingPromise



    }

}



