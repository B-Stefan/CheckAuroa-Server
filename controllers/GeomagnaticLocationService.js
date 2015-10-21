import request from "request"
import xml2json from "xml2json"
export default class GeomagnaticLocationService {

    static get API_URL() {return "http://omniweb.gsfc.nasa.gov/cgi/vitmo/vitmo_model.cgi"}
    transformToGeomagnetic(lat,lng, callback){
        if(typeof callback == 'undefined'){
            throw new Error ("transformToGeomagnetic: callback is undefiend")
        }
        let postOptions = {

            height: 0,
            geo_flag: 1,
            start: 1,
            model: "cgm",
            format: 3,
            linestyle: "solid",
            vars: 4,
            profile: 1,
            latitude: lat,
            year: 2015,
            stop: 1,
            step: 1,
            longitude: lng,
            imagex:640,
            imagey:480

        }
        //Make the post request
        request.post({
            url:GeomagnaticLocationService.API_URL,
            form: postOptions
        },(err, request,body)=>{

            //parse the XML
            let xmlData = xml2json.toJson(body,{object: true});

            //get rest lat
            let getMagnaticLat = xmlData.cgm_model.output_param.Height_profile.SP_CGM_Latitude.$t
            callback(getMagnaticLat);
        })
    }

}