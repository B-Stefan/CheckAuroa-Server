import SuncalcService from "./../../../server/services/SuncalcService"
import {assert} from "chai"
import moment from "moment"

describe('SuncalcService', function() {

  describe('getSunPosition', function() {

    beforeEach(function(){
      this.suncalcService  =  new SuncalcService();
    });


    let currentDate = moment();
    let lat = 53;
    let lng = 8;


    it("should return a valid response ", function () {

      let sunInformation =  this.suncalcService.getSunPosition(currentDate,lat,lng)
      console.log(sunInformation);
      assert.notEqual(sunInformation,null);
      assert.property(sunInformation,"altitude");

    });


  });


  describe('getMoonPosition', function() {

    beforeEach(function(){
      this.suncalcService  =  new SuncalcService();
    });

    let currentDate = moment();
    let lat = 53;
    let lng = 8;


    it("should return a valid response ", function () {
      let moonInformation = this.suncalcService.getMoonPosition(currentDate,lat,lng)
      console.log(moonInformation);
      assert.notEqual(moonInformation,null);
      assert.property(moonInformation  ,"altitude");
      assert.property(moonInformation  ,"azimuth");

    });


  });


  describe('getMoonIllumination', function() {

    beforeEach(function(){
      this.suncalcService  =  new SuncalcService();
    });

    let currentDate = moment();


    it("should return a valid response ", function () {
      let moonInformation = this.suncalcService.getMoonIllumination(currentDate)
      console.log(moonInformation);
      assert.notEqual(moonInformation,null);
      assert.property(moonInformation,"fraction");
      assert.property(moonInformation,"phase");
      assert.property(moonInformation,"angle");

    });


  });



  describe('getMoonInformation', function() {

    beforeEach(function(){
      this.suncalcService  =  new SuncalcService();
    });

    let currentDate = moment();
    let lat = 53;
    let lng = 8;


    it("should return a valid response ", function () {
      let moonInformation = this.suncalcService.getMoonInformation(currentDate,lat,lng);
      console.log(moonInformation);
      assert.notEqual(moonInformation,null);
      assert.property(moonInformation,"fraction");
      assert.property(moonInformation,"phase");
      assert.property(moonInformation,"angle");
      assert.property(moonInformation  ,"altitude");
      assert.property(moonInformation  ,"azimuth");

    });


  });




});
