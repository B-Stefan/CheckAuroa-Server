import * as moment from 'moment'
import KpIndexServiceRedisCached from './aurora-services/KpIndexServiceRedisCached'
import GeomagnaticLocationService from './aurora-services/GeomagnaticLocationService'
import SuncalcService from './SuncalcService'
import {findNextKPIndexForUTC} from './../utils'
import {predict} from 'aurora-probability-calculation'

export default class PredictionService {
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

  constructor () {
    this.kpIndexService = new KpIndexServiceRedisCached('apps.conts.de', 6379, process.env.REDIS_PASS)
    this.geomagnaticLocationService = new GeomagnaticLocationService()
    this.suncalcService = new SuncalcService()
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
    if (arguments.length !== 4 ||

        !(moment(date).isValid() && typeof lat === 'number' && typeof lng === 'number')) {
      throw new Error('Please provide date, lat,lng as arguemnts you provided: ' + JSON.stringify(arguments) + '- ' + arguments.length)
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
