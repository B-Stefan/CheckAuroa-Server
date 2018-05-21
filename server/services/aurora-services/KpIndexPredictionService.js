import * as moment from "moment"


/**
 * This service provide methods to get different predictions for a list of KpIndexInformations
 *
 */
export default class KpIndexPredictionService {

  /**
   * @private
   * @type {Array<KpInformation>}
   */

  kpInformationArr = [];

  /**
   *
   * @param kpInformationArr {Array<KpInformation>}
   */
  constructor(kpInformationArr){
    if(!Array.isArray(kpInformationArr)){
      throw new Error("Please provide a kpInformation arr as first constuctior paramenter for the KpIndexPredictionService you provided the type: " + typeof kpInformationArr)
    }
    this.kpInformationArr = kpInformationArr;
  }

  getHourPrediction(kpInformationArr){

  }

  /**
   * Returns a 3-Day prediction for a list of kpInformations.
   * This information contains a minimul kpValue entry and a maxKpValue entry
   *
   * @param kpInformationArr
   * @returns {*}
   */
  get3DaysPrediction(){
    let now = moment.utc().unix();
    let currentDate = moment.utc().startOf("day").add(12,"hours"); //Each day covers 24 hours from 12:00 pm to next day 12pm

    let kpInformationList  = this.kpInformationArr.filter((item)=>{
      return item.utc > now;
    });

    //Create an arr. with 3 entries for each day one entry
    let arr =  Array.apply(null, {length: 3}).map((item,index)=>{

      //For each day one entry
      let day = moment(currentDate).add(index, "days");

      //Find all kpInformation for the next 24 hours
      let matchingKpInformation = kpInformationList.filter((kpInformation)=>{
              return kpInformation.utc > day.unix() && kpInformation.utc < moment(day).add(1,"days").unix();
          })
          .sort((a,b)=>{return a.kpValue - b.kpValue});

      //Define min/Max
      let minEntry;
      let maxEntry;

      //If there is only one entry
      if(matchingKpInformation.length === 1 ){
        minEntry = matchingKpInformation.pop();
        maxEntry = minEntry;

      }else {
        maxEntry = matchingKpInformation.pop();
        minEntry = matchingKpInformation.reverse().pop();

      }

      return {
        date: day,
        min: minEntry,
        max: maxEntry

      }
    });

    return arr;
  }
}
