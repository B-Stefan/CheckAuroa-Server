'use strict';

exports.getRating = function(lng, lat, uTCDateTime) {

  var examples = {};
  
  examples['application/json'] = {
  "location" : {
    "lng" : 1.3579000000000001069366817318950779736042022705078125,
    "lat" : 1.3579000000000001069366817318950779736042022705078125
  },
  "kpIndex" : 0
};
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
