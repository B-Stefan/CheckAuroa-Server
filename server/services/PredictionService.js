import moment from 'moment'
import GeomagnaticLocationService from './aurora-services/GeomagnaticLocationService'
import SuncalcService from './SuncalcService'
import {findNextKPIndexForUTC} from './../utils'
import {predict} from 'aurora-probability-calculation'
import KPIndexService from './aurora-services/KPIndexService'

export default class PredictionService {
  constructor () {
    this.kpIndexService = new KPIndexService()
    this.geomagnaticLocationService = new GeomagnaticLocationService()
    this.suncalcService = new SuncalcService()
  }

  /**
   *
   */
  getKPInformation (from, to) {
    return this.kpIndexService.getKpListByUTCDate(from.unix())
  }

  /**
   *
   * @param gLat
   * @param gLng
   * @returns Promise
   */
  getMagneticLatLng (gLat, gLng) {
    return this.geomagnaticLocationService.transformToGeomagnetic(gLat, gLng)
  }

  /**
   *
   * @param date {date}
   * @param magneticPosition {{gLat,gLng}}
   * @param kpIndexInformation {kpIndexInformation}
   * @returns {Promise}
   */
  calculateProbability (date, magneticPosition, kpIndexInformation) {
    // KP index delta
    return predict(magneticPosition.latG, kpIndexInformation.kpValue)

    // sunset / sunrise / moon
  }

  getKpAndMagneticLocInformation (date, lat, lng) {
    // transform normal lat,lng to geomagnatic lat,lng
    let geomagneticPromise = this.getMagneticLatLng(lat, lng)

    let kpPromise = this.getKPInformation(date, moment(date).add(1.5, 'day'))

    // let kpPromise = KpIndexModel.prediction();

    return Promise
      .all([geomagneticPromise, kpPromise])
      .then((results) => {
        return {
          magneticLocation: results[0],
          kpInformations: results[1]
        }
      })
  }

  /**
   *
   * @param date {Date}
   * @param lat {number}
   * @param lng {number}
   * @returns {Array}
   */
  get24HourPrediction (date, lat, lng) {
    // Parameter check

    if (!moment(date).isValid()) {
      throw new Error(`Date is not valid ${date}`)
    }
    if (typeof lat !== 'number') {
      throw new Error(`lat is not valid ${lat}`)
    }
    if (typeof lng !== 'number') {
      throw new Error(`lng is not valid ${lng}`)
    }

    let normalizedDate
    if (moment(date).format('HHmmssSSS') === '000000000') {
      normalizedDate = moment(date).utc().add(8, 'hours')
    } else {
      normalizedDate = moment(date).utc().startOf('Day').add(8, 'hours')
    }

    let staticInformationPromise = this.getKpAndMagneticLocInformation(normalizedDate, lat, lng)

    // create an array with 24 items
    let result = Array.apply(null, {length: 24})
      .map((item, index) => {
        return moment(normalizedDate).add(index, 'hours') // set for each entry an date as value of the array
      })
      .map((date) => {
        // Return a promise for each item that contains the result of the request for KPInfomration
        return staticInformationPromise.then((result) => {
          let bestKpInfo = findNextKPIndexForUTC(date.unix(), result.kpInformations)

          // If no kpInformation are there (for example if I ask for the date 01.01.2020)
          let calulatedPropbabilityPromise = new Promise((resolve) => { resolve(0) })

          if (!bestKpInfo) {
            bestKpInfo = null
          } else {
            calulatedPropbabilityPromise = this.calculateProbability(date, result.magneticLocation, bestKpInfo)
          }

          return calulatedPropbabilityPromise.then((probability) => {
            return {
              date: date,
              probability: probability,
              kpInformation: bestKpInfo,
              sunInformation: this.suncalcService.getSunPosition(date, lat, lng),
              moonInformation: this.suncalcService.getMoonInformation(date, lat, lng)
            }
          })
        })
      })

    return result
  }
}
