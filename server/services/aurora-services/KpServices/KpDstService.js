
import request from "request"
import {KpInformation} from "./../KPIndexService"
import {unixToRFC3339Date} from "./../../../utils"
import moment from "moment"

export default class KpDstService {

  static get URL(){return "http://services.swpc.noaa.gov/products/geospace/planetary-k-index-dst.json"}


  static get ROW_COLLS(){
    return {
      "DATE": 0,
      "KP_VALUE": 1
    }
  }
  parseJSON(jsonArr){
    //remove header
    jsonArr.splice(0,1);

    //Map intput to instance of KpInfroamtion
    return jsonArr.map((rawData)=>{
      let rawDate = rawData[KpDstService.ROW_COLLS.DATE];
      let rawKp = rawData[KpDstService.ROW_COLLS.KP_VALUE];

      let kpInformation = new KpInformation();

      kpInformation.utc = moment.utc(rawDate).unix();
      kpInformation.date = unixToRFC3339Date(kpInformation.utc);

      kpInformation.kpValue = parseFloat(rawKp);
      kpInformation.original = JSON.stringify(rawData);

      return kpInformation
    })


  }
  getKpIndexList(){
    return new Promise((resolve,reject)=>{
      request({url: KpDstService.URL, json:true},(err,result)=>{
        if (err){
          reject(err)
        }

        let resultArr;

        try {
          resultArr = this.parseJSON(result.body);
        }catch (e){
          reject(e)
        }
        console.log("resultArr",resultArr.length);
        resolve(resultArr)
      })

    })
  }

}

