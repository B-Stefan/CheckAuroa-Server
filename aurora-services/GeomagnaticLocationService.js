import request from "request"
import xml2json from "xml2json"
export default class GeomagnaticLocationService {

    static get API_URL() {return "http://omniweb.gsfc.nasa.gov/cgi/vitmo/vitmo_model.cgi"}

    /**
     * Transform a geographic position to a geomagnatic
     * @param lat
     * @param lng
     * @returns Promise<gmLat>
     */
    transformToGeomagnetic(lat,lng){

        return new Promise((resolve,reject)=>{
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
                year: new Date().getFullYear(),
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
                if(err){
                    reject(err)
                    return;
                }
                //parse the XML
                let xmlData
                try {
                    xmlData = xml2json.toJson(body,{object: true});
                }catch (err){
                    reject({
                        err:err,
                        body: body
                    });
                    return;
                }

                //get rest lat
                let getMagnaticLat = xmlData.cgm_model.output_param.Height_profile.SP_CGM_Latitude.$t
                resolve(getMagnaticLat);

            })
        })
    }

}