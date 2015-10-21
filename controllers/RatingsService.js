import KPService from "./KPIndexService"
import GeomagnaticLocationService from "./GeomagnaticLocationService"
export function getRating(lng, lat, uTCDateTime,callback) {

  var examples = {};
  console.log("GET RAITNING")
  /**
   *
   */


  KPService.getKpByUTCDate(Date.UTC(), (data)=>{

    let last  = data[data.length-1]
    let response = {
      "location" : {
        "lng" : lng,
        "lat" : lat
      },
      "kpIndex" : last
    };

    callback(response)
  });

  const service = new GeomagnaticLocationService();
  service.transformToGeomagnetic(23,33,(geomagnaticLat,geomagnaticLng)=>{
    console.log("transformToGeomagnetic:",geomagnaticLat,geomagnaticLng)
  });




  
}
