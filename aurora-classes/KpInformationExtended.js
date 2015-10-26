
import {KpInformation} from "./../aurora-api/clients/typescript-node-client/api"
export default class KpInformationExtended extends KpInformation {
    minutes;
    original;
    constructor(kpInformationInstance){
        super();
        if(kpInformationInstance  instanceof KpInformation){
            this.utc = kpInformationInstance.utc;
            this.date = kpInformationInstance.date;
            this.kpValue = kpInformationInstance.kpValue;
            this.minutes= kpInformationInstance.minutes;
            this.original = kpInformationInstance.original;
        }
    }
}