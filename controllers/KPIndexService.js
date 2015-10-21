"use strict";
import request from "request"
import {isDevMode} from "./../utils"
import moment from "moment";
import KpWingService from "./KpServices/KpWingService"

class KPIndexService {

    constructor(){
        this.kpWingService =  new KpWingService();

    }

    getKpByUTCDate(UTCDate, callback){

        this.kpWingService.getSortedList(callback);

    }


}

export default new KPIndexService();

