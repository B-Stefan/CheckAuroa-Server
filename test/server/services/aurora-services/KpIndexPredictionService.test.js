import KpIndexPredictionService from "./../../../../server/services/aurora-services/KpIndexPredictionService"
import KPIndexService from "./../../../../server/services/aurora-services/KPIndexService"
import assert from "assert"
import moment from "moment"
describe('KpIndexPredictionService', function() {


  describe('Constructor', function() {

    it("should create a new instance", function () {

      let arr = [];
      new KpIndexPredictionService(arr);

    });

    it("should throw error while creating new instance", function () {

      let arr = "String instead of array ";
      assert.throws(()=> new KpIndexPredictionService(arr), Error);
      assert.throws(()=> new KpIndexPredictionService(), Error);

    });

  });

  describe('get3DaysPrediction', function() {

    this.timeout(10000);
    let kPIndexService = new KPIndexService();
    beforeEach(function(callback){
      let self = this;
      kPIndexService.getKpList().then((resultsList)=>{
        self.predictionService  =  new KpIndexPredictionService(resultsList);
        callback();
      });
    });

    it("should return 3 items", function () {

     let result = this.predictionService.get3DaysPrediction();
      assert.equal(result.length,3,"The result should contains 3 items")

    });

    it("should be the next 3 days", function () {

      let today = moment().utc();

      let dateFormat = "DD.MM.YYYY";

      //create arr for the next 3 days
      let next3Days = Array.from([null,null,null], (item,index)=>{
          return moment(today).add(index,"days").format(dateFormat);
      });

      //transform results to an array with the next 3 days (hopefully)
      let result = this.predictionService
                    .get3DaysPrediction()
                    .map((item)=>{
                      return item.date.format(dateFormat)
                    });
      assert.deepEqual(result,next3Days,"The result should be for the upcoming 3 days")

    });

    it("should return items that all have a min / max value ", function () {

      //transform results to an array with the next 3 days (hopefully)
      this.predictionService
          .get3DaysPrediction()
          .forEach((item)=>{
            console.log("item:", JSON.stringify(item));
            assert.notEqual(item.min,null, "Every item should have a min , null is not allowed ")
            assert.notEqual(item.max,null, "Every item should have a min and max value, null is not allowed ")
          })

    })




  })




});
