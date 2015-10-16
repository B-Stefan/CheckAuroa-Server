'use strict';

var url = require('url');


var Default = require('./DefaultService');


module.exports.locationGet = function locationGet (req, res, next) {
  

  var result = Default.locationGet();

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};
