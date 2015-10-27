import moment from "moment"
export function isDevMode(){
    return process.env.NODE_ENV === 'development'
}

export function unixToRFC3339Date(unixUtcDate){
    return moment.unix(unixUtcDate).utcOffset(0).format("YYYY-MM-DDTHH:mm:ssZ");
}