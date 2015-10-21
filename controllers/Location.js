'use strict';

var url = require('url');


var Location = require('./LocationService');


module.exports.locationGet = function locationGet (req, res, next) {
  

  var result = Location.locationGet();

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.updateLocation = function updateLocation (req, res, next) {
  var deviceId = req.swagger.params['deviceId'].value;
  var deviceType = req.swagger.params['deviceType'].value;
  var lat = req.swagger.params['lat'].value;
  var lng = req.swagger.params['lng'].value;
  

  var result = Location.updateLocation(deviceId, deviceType, lat, lng);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};
