
// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

/* tslint:disable:no-unused-variable */

export class OK {
    msg: string;
}

export class Error {
    msg: string;
    /**
    * The error code
    */
    code: Error.CodeEnum;
}

export module Error {
    export enum CodeEnum { 
        INTERNAL = <any> 'INTERNAL',
        KP_SERVICE_ERROR = <any> 'KP_SERVICE_ERROR',
        WEATHER_SERVICE_ERROR = <any> 'WEATHER_SERVICE_ERROR',
        SUNSETRISE_SERVICE_ERROR = <any> 'SUNSETRISE_SERVICE_ERROR',
    }
}
export class Location {
    lat: number;
    lng: number;
}

export class GeomagnaticLocation {
    latG: number;
    lngG: number;
}

export class KpInformation {
    date: number;
    kpValue: number;
}

export class WeatherInformation {
    summary: string;
}

export class Rating {
    location: Location;
    locationGeomagnatic: GeomagnaticLocation;
    kp: KpInformation;
    weather: WeatherInformation;
}

export class Notification {
    playSound: boolean;
}

