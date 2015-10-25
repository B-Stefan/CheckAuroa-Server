import KPService from "./KPIndexService"
import GeomagnaticLocationService from "./GeomagnaticLocationService"
export default class RatingsService{


  constructor(){
    this.geoService = new GeomagnaticLocationService();
    this.kpService = new KPService()
  }
  getRatings(lng, lat, uTCDateTime){

    let kpIndexPromise = this.kpService.getKpByUTCDate(uTCDateTime);

    let geoPromise = this.geoService.transformToGeomagnetic(lat,lng);

    return new Promise((resolve,reject)=>{
      Promise.all([kpIndexPromise,geoPromise]).then((data)=> {
        console.log("FINISHED");

        let geoInformation = data.pop();
        let kpInformation = data.pop();

        let response = {
          "location": {
            "lng": lng,
            "lat": lat
          },
          "locationGeomagnetic": geoInformation,
          "kpIndex": kpInformation
        };

        resolve(response)
      }).catch((err)=>{
        console.log(err);
        reject(err);
      })
    })





  }


}
