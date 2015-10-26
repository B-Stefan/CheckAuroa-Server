"use strict";
import request from "request"
import {isDevMode} from "./../../utils"
import moment from "moment";
import KPIndexInformation from "./../../aurora-classes/KpInformationExtended"

/**
 * Class for one row of the text file
 */
class Row{

    /**
     *              0 = nominal solar wind input data,
     #            1 = data are good but required an extrapolation
     #            2 = data are bad: incomplete ACE speed data
     #            3 = data are bad: solar wind speed input errors; model output likely unreliable
     #            4 = missing Wing Kp data
     * @returns {{OK: number, MISSING: number}}
     * @constructor
     */
    static get STATUS(){
        return {


            NORMAL: 0,
            GOOD: 1,
            INCOMPLETE: 2,
            UNRELIABLE: 3,
            MISSING : 4,
            ERROR : -1,
        }
    }

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

        var status = rowArr[Row.COLLUMS.STATUS];
        if(rowArr.length == Object.keys(Row.COLLUMS).length && (status != Row.STATUS.MISSING  && status != Row.STATUS.ERROR)){
            return true;
        }
        return false;
    }
    /**
     * Enum for the collums
     * @returns {{CREATED_AT_YEAR: number, CREATED_AT_MONTH: number, CREATED_AT_DAY: number, CREATED_AT_TIME: number, STATUS: number, PREDICTION_4_HOURS_YEAR: number, PREDICTION_4_HOURS_MONTH: number, PREDICTION_4_HOURS_DAY: number, PREDICTION_4_HOURS_TIME: number, PREDICTION_4_HOURS_KP_INDEX: number, PREDICTION_4_HOURS_MINUTES: number, PREDICTION_8_HOURS_YEAR: number, PREDICTION_8_HOURS_MONTH: number, PREDICTION_8_HOURS_DAY: number, PREDICTION_8_HOURS_TIME: number, PREDICTION_8_HOURS_KP_INDEX: number, PREDICTION_8_HOURS_MINUTES: number}}
     * @constructor
     */
    static get COLLUMS(){
        return {
            "CREATED_AT_YEAR": 0,
            "CREATED_AT_MONTH": 1,
            "CREATED_AT_DAY": 2,
            "CREATED_AT_TIME": 3,
            "STATUS": 4,

            "PREDICTION_4_HOURS_YEAR": 5,
            "PREDICTION_4_HOURS_MONTH": 6,
            "PREDICTION_4_HOURS_DAY": 7,
            "PREDICTION_4_HOURS_TIME": 8,
            "PREDICTION_4_HOURS_KP_INDEX": 9,
            "PREDICTION_4_HOURS_MINUTES": 10,

            "PREDICTION_8_HOURS_YEAR": 11,
            "PREDICTION_8_HOURS_MONTH": 12,
            "PREDICTION_8_HOURS_DAY": 13,
            "PREDICTION_8_HOURS_TIME": 14,
            "PREDICTION_8_HOURS_KP_INDEX": 15,
            "PREDICTION_8_HOURS_MINUTES": 16,
            "USAF_EST_KP": 17,

        }
    }
    constructor(rowValues){

        /**
         *  Row came in this format
         * [ '2015', => createdAt - year
         '10',  => createdAt - month
         '21',  => createdAt - day
         '0715', => createdAt - time (UTC!!)
         '0', => status
         '2015', => 4HourPrediction date -> year
         '10', => 4HourPrediction date -> month
         '21', => 4HourPrediction  date -> day
         '0821', => => 4Hour prediction date -> time (UTC)
         '1.67', => 4hour prediction KP-INDEX
         '66.0', => minutes (4HourPrediction - createdAt  = 66)
         '2015',=> 8HourPrediction -> year
         '10', => 8HourPrediction -> month
         '21',=> 8HourPrediction -> day
         '1121',=> 8HourPrediction -> time (UTC)
         '1.33', => 8HourPrediction -> KP-Index
         '246.0', => 8HourPrediction -> minutes after the created at (8HourPrediction - createdAt = 246)
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
        this.prediction1Hours = new KPIndexInformation();
        this.prediction4Hours = new KPIndexInformation();

        //Set up dates
        this.prediction1Hours.utc  = Row.getUTCDateFromRowARR(Row.COLLUMS.PREDICTION_4_HOURS_YEAR,rowValues);
        this.prediction1Hours.date = moment.unix(this.prediction1Hours.utc).utcOffset(0).format("YYYY-MM-DDTHH:mm:ssZ");


        this.prediction4Hours.utc  = Row.getUTCDateFromRowARR(Row.COLLUMS.PREDICTION_8_HOURS_YEAR,rowValues);
        this.prediction4Hours.date = moment.unix(this.prediction4Hours.utc).utcOffset(0).format("YYYY-MM-DDTHH:mm:ssZ");

        this.createdAt              = Row.getUTCDateFromRowARR(Row.COLLUMS.CREATED_AT_YEAR,rowValues);


        //Set up Kp-Values
        this.prediction1Hours.kpValue = rowValues[Row.COLLUMS.PREDICTION_4_HOURS_KP_INDEX];
        this.prediction4Hours.kpValue = rowValues[Row.COLLUMS.PREDICTION_8_HOURS_KP_INDEX];

        //Set up minutes

        this.prediction1Hours.minutes = rowValues[Row.COLLUMS.PREDICTION_4_HOURS_MINUTES];
        this.prediction4Hours.minutes = rowValues[Row.COLLUMS.PREDICTION_8_HOURS_MINUTES];

        this.prediction1Hours.original = rowValues.join(";");
        this.prediction4Hours.original = rowValues.join(";");

        //Set up status
        this.status = rowValues[Row.COLLUMS.STATUS];

        this.originalData = rowValues.join(";").toString();

    }
    originalData;
    createdAt;
    status;
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
                    return new KPIndexInformation(row.prediction1Hours);
                });

                //Add to the list the last 12 entries and form this entries the 4 hour prediction (12 because there is every 15 minutes a news row so 12/4 = 4h)
                let last12Predictions  = sorted.slice(sorted.length-12,sorted.length);
                last12Predictions.forEach((row)=>{

                    let info = new KPIndexInformation(row.prediction4Hours);

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
        let startIndex = lineArr.indexOf("#-----------------------------------------------------------------------------------------------------------------");
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
             '0', => status
             '2015', => 4HourPrediction date -> year
             '10', => 4HourPrediction date -> month
             '21', => 4HourPrediction  date -> day
             '0821', => => 4Hour prediction date -> time (UTC)
             '1.67', => 4hour prediction KP-INDEX
             '66.0', => minutes (4HourPrediction - createdAt  = 66)
             '2015',=> 8HourPrediction -> year
             '10', => 8HourPrediction -> month
             '21',=> 8HourPrediction -> day
             '1121',=> 8HourPrediction -> time (UTC)
             '1.33', => 8HourPrediction -> KP-Index
             '246.0 ', => 8HourPrediction -> minutes after the created at (8HourPrediction - createdAt = 246)
             '2.33' ]
             *
             * @type {Array.<T>}
             */
            let rowValues = row.split(' ').filter((cell)=>cell != " " && cell != '')
            if(Row.isValidRow(rowValues)){

                let newRow = new Row(rowValues);
                results.push(newRow)
            }else {
                console.log("Row not valid ", rowValues)
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
        return new Promise((resolve,reject)=>{
            request(KpWingService.KP_API_URL, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let results = this.parseKPRawFile(body)
                    resolve(results)
                }else {
                    reject({
                        err: error,
                        response: response
                    })
                }
            })
        })



    }

}



