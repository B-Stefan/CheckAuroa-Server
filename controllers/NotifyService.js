'use strict';

export function createNotification(body) {

  var examples = {};
  
  examples['application/json'] = {
  "msg" : "aeiou"
};
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
export function deleteNotification() {

  var examples = {};
  
  examples['application/json'] = {
  "msg" : "aeiou"
};
  

  
  if(Object.keys(examples).length > 0)
    return examples[Object.keys(examples)[0]];
  
}
