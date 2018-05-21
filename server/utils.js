import * as moment from 'moment'
export function isDevMode () {
  return process.env.NODE_ENV === 'development'
}

export function unixToRFC3339Date (unixUtcDate) {
  return moment.unix(unixUtcDate).utcOffset(0).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
}
export function findNextKPIndexForUTC (unixUTC, listOFKpIndex) {
  return listOFKpIndex
    .slice()
    .sort((a, b) => Math.abs(a.utc - unixUTC) - Math.abs(b.utc - unixUTC))
    .reverse()
    .pop()
}
