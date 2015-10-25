import KPService from "./KPIndexService"
import GeomagnaticLocationService from "./GeomagnaticLocationService"
export function getRating(lng, lat, uTCDateTime,callback) {

  var examples = {};
  if(uTCDateTime  == undefined || uTCDateTime == "now"){
    uTCDateTime  = Date.now()
  }
  console.log("GET RAITNING")
  /**
   *
   */

  const service = new GeomagnaticLocationService();

  let kpIndexPromise = KPService.getKpByUTCDate(uTCDateTime)
  let geoPromise = service.transformToGeomagnetic(lat,lng);

  Promise.all([kpIndexPromise,geoPromise]).then((data)=> {
    console.log("FINISHED")

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

    callback(response)
  }).catch((err)=>{
    console.log(err);
  })




  
}
