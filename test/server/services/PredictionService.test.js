import PredictionService from "./../../../server/services/PredictionService"
import {assert} from "chai"
import moment from "moment"

describe('PredictionService', function() {


  /*
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

  */

  describe('getMagneticLatLng', function() {

    beforeEach(function(){
      this.predictionService  =  new PredictionService();
    });

    let lat = 30;
    let lng = 40;

    let glat = 24.34;
    let gLng = 0 ;

    it("should accept a lat and lng as parameters", function () {
      this.predictionService.getMagneticLatLng(lat,lng)
    });

    it("should return a promise with geomagnatic pos", function () {
      return this.predictionService.getMagneticLatLng(lat,lng)
          .then((geomagneticPosition)=>{
            assert.equal(geomagneticPosition.latG,glat, "The geomagnetic lat is not valid" + JSON.stringify(geomagneticPosition));
            assert.equal(geomagneticPosition.lngG,gLng,  "The geomagnetic lng is not valid", JSON.stringify(geomagneticPosition))
          })
    });


  });
  describe('getKpInformations', function() {

    beforeEach(function(){
      this.predictionService  =  new PredictionService();
    });

    let from = moment().utc();
    let to = moment(from).add(1,"days");

    it("should accept a from, too as parameters", function () {
      this.predictionService.getKPInformation(from,to)
    });


    it("should return a array of KpInformation", function () {
      this.timeout(5000);
      return this.predictionService.getKPInformation(from,to)
          .then((result)=>{

            assert.isAbove(result.length,1);


            return result.map((item)=>{
              console.log(JSON.stringify(item));
              assert.property(item,"kpValue");
              assert.property(item,"date");

              return item;
            })
          })
    })

  });

  describe('get24HourPrediction', function() {


    let date = moment();
    let lat = 40;
    let lng = 40;

    beforeEach(function(){
      this.predictionService  =  new PredictionService();
    });

    it("should accept a date, lat, lng as parameters", function () {


        assert.doesNotThrow(()=> this.predictionService.get24HourPrediction(date,lat,lng),Error);
        assert.throws(()=>this.predictionService.get24HourPrediction(lat,lng),Error);
        assert.throws(()=>this.predictionService.get24HourPrediction(lat),Error);
        assert.throws(()=>this.predictionService.get24HourPrediction(),Error);
        assert.throws(()=>this.predictionService.get24HourPrediction(lat,lng,date),Error)
    });


    it("should return 24 items", function () {

      let result = this.predictionService.get24HourPrediction(date,lat,lng);
      assert.equal(result.length,24,"The result should contains 24 items, for each hour one item")

    });

    describe("should be the next 24 hours based on the date ", function () {

      let dateFormat = "DD.MM.YYYY HH:mm";
      let predictionService = new PredictionService();

      this.timeout(10000);
      function runTest(date,callback){

        //create arr for the next 24 hours
        let next24Hours= Array.apply(null, {length: 24})
            .map((item,index)=>{
              return moment(date).add(index,"hours").format(dateFormat);
            });

        //transform results to an array with the next 3 days (hopefully)
        let promisedResults = predictionService.get24HourPrediction(date,lat,lng);

        return Promise
              .all(promisedResults)//wait for all promises
              .then((results)=>{

                  //transform the result object to list of dates
                  let result = results.map((item)=>{
                    return item.date.format(dateFormat)
                  });

                  console.log(JSON.stringify(result))
                  console.log(JSON.stringify(next24Hours))
                  assert.deepEqual(result,next24Hours,"The result should be for the upcoming 24 hours starting from:" + date.format());

                return results;
              })

      }

      let today = moment().utc().startOf("day").add(8,"hours");
      let tomorrow = moment(today).add(1,"day");

      it("For today it should be 24 items",function(){

        return runTest(today);
      });

      it("For tomorrow it should be 24 items",function(){
        return runTest(tomorrow)
      });



    });

    it("should be a list of items that have all item props ", function(){

      this.timeout(5000);
      let from = moment().utc();
      let lat = 53;
      let lng = 8;


      return Promise.all(this.predictionService.get24HourPrediction(from,lat,lng))
              .then(function (result) {

                assert.isAbove(result.length,1);

                return result.map((item)=>{
                  assert.property(item,"date");
                  assert.property(item,"probability");
                  assert.property(item,"kpInformation");
                  assert.property(item,"sunInformation");
                  assert.property(item,"moonInformation");

                  return item;
                })
              })

    })


  })

  describe("get3DaysPrediction", function(){

    describe.skip("should return items that all have a min / max value ", function () {

      /*
      //transform results to an array with the next 3 days (hopefully)
      this.predictionService
          .get3DaysPrediction(date,lat,lng)
          .forEach((item)=>{
            console.log("item:", JSON.stringify(item));
            assert.notEqual(item.min,null, "Every item should have a min , null is not allowed ")
            assert.notEqual(item.max,null, "Every item should have a min and max value, null is not allowed ")
          })
      */
    })

  })




});
