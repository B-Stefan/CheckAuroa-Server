import PredictionService from "./PredictionService"

export default class PredictionServiceDatabase extends PredictionService{


  /**
   * @private
   * @type app
   */
  app;

  constructor(app){
    super();
    this.app = app;
    console.log(app)
  }

  /**
   * Override
   */
  getKPInformation(from,to){
    return this.app.models.KpIndex.find({
      where: {
        utc: {gt: from.unix()}
      }
    })
  }

}