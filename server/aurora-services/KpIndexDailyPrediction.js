import moment from "moment"



export default class KpIndexDailyPrediction {


  constructor(){

  }

  getHourPrediction(kpInformationArr){

  }
  get3DaysPrediction(kpInformationArr){

    let currentDate = moment.utc().startOf("day").add(12,"hours");

    let arr =  Array.apply(null, {length: 3}).map((item,index)=>{

      //For each day one entry
      let day = moment(currentDate).add(index, "days");

      //Find all kpInformation for the next 24 hours
      let matchingKpInformation = kpInformationArr.filter((kpInformation)=>{
              return kpInformation.utc > day.unix() && kpInformation.utc < moment(day).add(1,"days").unix();
          })
          .sort((a,b)=>{return a.kpValue - b.kpValue});

      //Define min/Max
      let minEntry;
      let maxEntry;

      //If there is only one entry
      if(matchingKpInformation.length == 1 ){
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