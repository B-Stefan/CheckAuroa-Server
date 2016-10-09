
import request from "request"
import {KpInformation} from "./../KPIndexService"
import {unixToRFC3339Date} from "./../../../utils"
import moment from "moment"

export default class KPIndexDstService {

  static get URL(){return "http://services.swpc.noaa.gov/products/geospace/planetary-k-index-dst.json"}


  static get ROW_COLLS(){
    return {
      "DATE": 0,
      "KP_VALUE": 1
    }
  }
  parseJSON(jsonArr){
    //remove header
    jsonArr.splice(0,1)

    //Map intput to instance of KpInfroamtion
    return jsonArr.map((rawData)=>{
      let rawDate = rawData[KPIndexDstService.ROW_COLLS.DATE];
      let rawKp = rawData[KPIndexDstService.ROW_COLLS.KP_VALUE];

      let kpInformation = new KpInformation();

      kpInformation.utc = moment.utc(rawDate).unix();
      kpInformation.date = unixToRFC3339Date(kpInformation.utc);

      kpInformation.kpValue = parseFloat(rawKp);
      kpInformation.original = JSON.stringify(rawData);

      return kpInformation
    })


  }
  getCompleteFile(){
    return new Promise((resolve,reject)=>{
      console.log("start get ")
      request({url: KPIndexDstService.URL, json:true},(err,result)=>{
        if (err){
          reject(err)
        }
        this.parseJSON(result.body)
        resolve()
      })

    })
  }
  getNext45MinPrediction(){
    return new Promise((resolve,reject)=>{
      request(KpDstService.URL).then((result)=>{
        console.log(result)
      })

    })
  }

}

