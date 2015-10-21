'use strict';

exports.createNotification = function(body) {

  var examples = {};
  
  examples['application/json'] = {
  "msg" : "aeiou"
};
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
exports.deleteNotification = function() {

  var examples = {};
  
  examples['application/json'] = {
  "msg" : "aeiou"
};
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
