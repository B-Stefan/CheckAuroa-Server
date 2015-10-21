'use strict';

var url = require('url');


var Ratings = require('./RatingsService');


module.exports.getRating = function getRating (req, res, next) {
  var lng = req.swagger.params['lng'].value;
  var lat = req.swagger.params['lat'].value;
  var uTCDateTime = req.swagger.params['UTCDateTime'].value;
  console.log("GET RAITING ")

  var result = Ratings.getRating(lng, lat, uTCDateTime,(result)=>{
    if(typeof result !== 'undefined') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result || {}, null, 2));
    }
    else
      res.end();
  });

};
