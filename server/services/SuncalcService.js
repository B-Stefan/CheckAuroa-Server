import SunCalc from "suncalc";
import moment from "moment"; 

export default class SuncalcService {

  /**
   *
   * @param date {date}
   * @param lat {number}
   * @param lng {number}
   * @returns {object} see https://github.com/mourner/suncalc
   */
  getSunPosition(date,lat,lng){
    date = moment(date).toDate();
    return SunCalc.getPosition(date, lat,lng)
  }

  /**
   *
   * @param date {date}
   * @param lat {number}
   * @param lng {number}
   * @returns {object} see  https://github.com/mourner/suncalc
   */
  getMoonPosition(date, lat, lng){
    date = moment(date).toDate();

    return SunCalc.getMoonPosition(date,lat,lng);

  }

  /**
   *
   * @param date {date}
   * @returns {object} see https://github.com/mourner/suncalc
   */
  getMoonIllumination(date){
    date = moment(date).toDate();
    return SunCalc.getMoonIllumination(date)
  }


  /**
   *
   * @param date {date}
   * @param lat {number}
   * @param lng {number}
   * @returns {{altitude,azimuth,angle,phase,friction}}
   */
  getMoonInformation(date,lat,lng){

    date = moment(date).toDate();
    
    let position = this.getMoonPosition(date,lat,lng);
    let illu = this.getMoonIllumination(date);

    illu.altitude = position.altitude;
    illu.azimuth = position.azimuth;

    return illu
  }
}