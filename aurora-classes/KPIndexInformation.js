export default class KPInformation {
    date;
    kpValue;
    minutes;
    original;
    constructor(kpInformationInstance){
        if(kpInformationInstance  instanceof KPInformation){
            this.date = kpInformationInstance.date;
            this.kpValue = kpInformationInstance.kpValue;
            this.minutes= kpInformationInstance.minutes;
            this.original = kpInformationInstance.original;
        }
    }
}