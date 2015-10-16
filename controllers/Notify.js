'use strict';

var url = require('url');


var Notify = require('./NotifyService');


module.exports.createNotification = function createNotification (req, res, next) {
  var body = req.swagger.params['body'].value;
  

  var result = Notify.createNotification(body);

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};

module.exports.deleteNotification = function deleteNotification (req, res, next) {
  

  var result = Notify.deleteNotification();

  if(typeof result !== 'undefined') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
  }
  else
    res.end();
};
