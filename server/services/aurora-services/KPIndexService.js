import KpWingService from "./KpServices/KpWingService"
import Kp3DayForecast from "./KpServices/Kp3DayForecast"
import KpDstService from "./KpServices/KpDstService"

export class KpInformation {

  /**
   * @type number
   */
  utc;

  /**
   * @type date
   */
  date;

  /**
   * @type number
   */
  kpValue;


  /**
   * @type string
   */
  original;


  constructor(kpInformationInstance){
    if(kpInformationInstance  instanceof KpInformation){
      this.utc = kpInformationInstance.utc;
      this.date = kpInformationInstance.date;
      this.kpValue = kpInformationInstance.kpValue;
      this.original = kpInformationInstance.original;
    }
  }

}


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
        this.pendingKpRequest = null;
        this.kpWingService =  new KpWingService();
        this.kp3DayService =  new Kp3DayForecast();
        this.kpDstServie =  new KpDstService();

    }

    /**
     * Collect all kpInformation from different services and return a unsorted list of KpInformation
     * @method getKpList
     * @class KPIndexService
     * @returns {Promise<KpInformation[]>}
     */
    getKpList(){

        if(this.pendingKpRequest  == null ){
          this.pendingKpRequest = new Promise((resolve,reject)=>{
            let kp3Days = this.kp3DayService.getKpIndexForNextDays();
            let kpWing = this.kpWingService.getList();
            //let kpDst = this.kpDstServie.getKpIndexList();

            Promise.all([kpWing,kp3Days]).then((data)=>{

              let flattern = [].concat.apply([],data);

              resolve(flattern);
              this.pendingKpRequest = null;

            }).catch(reject)
          })
        }
        return this.pendingKpRequest
    }

    /**
     * Returns a list of kp information. All entires are after the param UTCDate
     * @method getKpListByUTCDate
     * @class KPIndexService
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

                        })
                    .sort((a,b)=> a.utc - b.utc);

                resolve(nextKpInformation)

            }).catch(reject);
        })
    }
    /**
     * Returns the KPInformation that is the nearest to the param UTCDate
     * @method getKpByUTCDate
     * @class KPIndexService
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

