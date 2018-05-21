import request from  "request"
import * as moment from "moment"
export class ProbabilityInformation {
  date;
  position = {
      lat:0,
      lng:0
  };
  probability = 0;
}

export default class NowCastAuroraService {

  static URL = "http://services.swpc.noaa.gov/text/aurora-nowcast-map.txt"

  static degreesPerCollum = 0.32846715;

  static degreesPerRow = 0.3515625;


  /**
   * Value to check if all data get passed right
   * @type {number}
   */
  static rowCountExpected = 512;

  static colCountExpected = 1024;

  static PRODUCT_VALID_AT_CAPTION = "# Product Valid At";

  static PRODUCT_CREAtED_AT_CAPTION = "# Product Generated At";

  static validateMatrix(matrix){
    if(matrix.length == NowCastAuroraService.rowCountExpected){
      if(matrix[0].length == NowCastAuroraService.colCountExpected){
        return true;
      }
    }
    return false;
  }

  static getProbabilityByLatLng(matrix, lat,lng){
    if(!NowCastAuroraService.validateMatrix(matrix)){
      console.log(matrix.length);
      console.log(matrix[0].length);
      //throw new Error ("Not valid matrix provided")

    }

    let row = (lat+90) / NowCastAuroraService.degreesPerRow; // + 90 because the latitude goes from -90 to 90, for the matrix we need 0 - 180
    let col = lng / NowCastAuroraService.degreesPerCollum;

    let rowIndex = Math.round(row);
    let colIndex = Math.round(col);

    console.log("lat,row", lat," - " , rowIndex, row);
    console.log("lng, col", lng," - " , colIndex, row);

    return matrix[rowIndex][colIndex];
  }

  constructor(){

  }

  parseResponse(txtRaw){

    let splitArray = txtRaw.split("\n");

    /**
     * Get the meta data for this batch
     */
    /**
     * #Aurora Specification Tabular Values
     # Product: Ovation Aurora Short Term Forecast    <path to tabular data>
     # Product Valid At: 2016-03-24 09:05
     # Product Generated At: 2016-03-24 08:35
     */

    let metaData = splitArray.filter((item)=>{
      return item.indexOf(NowCastAuroraService.PRODUCT_VALID_AT_CAPTION) > -1 || item.indexOf(NowCastAuroraService.PRODUCT_CREAtED_AT_CAPTION) > -1
    }).map((row)=>{

      /**
       # Product Valid At: 2016-03-24 09:05
       # Product Generated At: 2016-03-24 08:35
       */

      let split = row.replace(":","<split>").split("<split>");

      return {
        caption: split[0],
        date:    moment.utc(split[1])
      }
    }).reduce((a,b, index, arr)=>{

      /**
       * arr = [{caption: # Product Valid At", date: new Date()}, ... ]
       */
      /**
       * Find right item in array
       */
      return {
          createdAt: arr.find((item)=>{return item.caption === NowCastAuroraService.PRODUCT_CREAtED_AT_CAPTION}).date,
          validAt: arr.find((item)=>{return item.caption === NowCastAuroraService.PRODUCT_VALID_AT_CAPTION}).date
        }
    });


    /**
     *
     * # Tabular Data is on the following grid
     #
     #   1024 values covering 0 to 360 degrees in the horizontal (longitude) direction  (0.32846715 degrees/value)
     #   512 values covering -90 to 90 degrees in the vertical (latitude) direction  (0.3515625 degrees/value)
     #   Values range from 0 (little or no probability of visible aurora) to 100 (high probability of visible aurora)
     #  ---> long (1024)
       | 0   0   0   0   0   44   0   0   0   0   0   0
       | 0   0   0   19   39   45   0   0   0   0   0   0
     *
     *  lat (512)
     */


    /**
     * transform the matrix
     * @type {Array}
     */
    let resultArr = splitArray
        .filter((row)=>{
          return row.indexOf("#") == -1; //Filter description
        })
        .filter((row)=>row.length > 0) // filter out all spaces
        .map((row, rowIndex)=>{

          /**
           * only one row
           *
           * 1 3 0 0 0 0 0.... -> 1024
           */

          /**
           * calculate the latitute for this row.
           * @type {number}
           */
          let rowLat = (rowIndex) * NowCastAuroraService.degreesPerRow -90;

          //for each entry in row so the (0,0) (0,1) ....
          return row
              .split(" ") //split row into array
              .filter((content)=>{return content.length > 0 }) //filter out all missing spaces
              .map((number)=>{ return parseInt(number);});//parse number

    });

    return {
      createdAt: metaData.createdAt,
      validAt: metaData.validAt,
      entries: resultArr
    }


  }


  convertMatrixToClasses(etries) {

    let re = etries.map((row, rowIndex)=> {

      /**
       * only one row
       *
       * 1 3 0 0 0 0 0.... -> 1024
       */

      /**
       * calculate the latitute for this row.
       * @type {number}
       */
      let rowLat = (rowIndex) * NowCastAuroraService.degreesPerRow - 90;

      row.map((collum, collumIndex)=> {
        let item = new ProbabilityInformation();
        item.probability = collum;
        item.position.lat = rowLat;
        item.position.lng = (collumIndex) * NowCastAuroraService.degreesPerCollum;
        return item;
      });
    });

    return [].concat.apply([],re); //Flattern [[{},{}],[...]] =>[{},{},{},...]
  }
  getList(){
    return new Promise((resolve, reject)=>{
      request.get(NowCastAuroraService.URL, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let results = this.parseResponse(body);
          resolve(results)
        }else {
          reject({
            err: error,
            response: response
          })
        }
      })
    });

  }

}
