'use strict';

var turningPoints = function(data, k, prop) {
  if(data.count() < 10){ return data; } //data too small

  var n = 1;
  var tps = [];
  while(n <= k){
    if(n === 1){ tps = firstLevelTP(data, prop); }
    else{ tps = higherLevelsTP(data, tps, prop); }
    n++;
  }

  return tps.map(function(idx){
    return data.get(idx);
  });
};

var firstLevelTP = function(data, prop){
  var result = [];
  for(var i = 1; i < data.count() -1; i++){
    var p = data.get(i).get(prop);
    var prev = data.get(i-1).get(prop);
    var next = data.get(i+1).get(prop);

    if ((p < next && p < prev) || (p > next && p > prev)){
      result.push(i);
    }
  }

  return result;
};

var higherLevelsTP = function(data, lowerLevelTP, prop){
  var result = [];
  for(var i = 0; i < lowerLevelTP.length;){
    var idx = lowerLevelTP[i];
    if(containsPointInUptrend(i, data, prop) ||
       containsPointInDowntrend(i, data, prop) ||
       pointInSameTrend(i, data, prop)){
      result.push(idx);
      if(lowerLevelTP[i+3]){
        result.push(lowerLevelTP[i+3]);
      }
      i += 3;
    }
    else{
      result.push(idx);
      i++;
    }
  }
  return result;
};

var containsPointInUptrend = function(i, data, prop) {
  var p = data.get(i).get(prop);
  var nextOne = data.get(i+1).get(prop);
  var nextTwo = data.get(i+2).get(prop);
  var nextThree = data.get(i+2).get(prop);

  if (p < nextOne && p < nextTwo && nextOne < nextThree && nextTwo < nextThree &&
    (nextOne - nextTwo) < (p - nextTwo) + (nextOne - nextThree)){
    return true;
  }
  else{
    return false;
  }
};

var containsPointInDowntrend = function(i, data, prop) {
  var p = data.get(i).get(prop);
  var nextOne = data.get(i+1).get(prop);
  var nextTwo = data.get(i+2).get(prop);
  var nextThree = data.get(i+2).get(prop);

  if (p > nextOne && p > nextTwo && nextOne > nextThree && nextTwo > nextThree &&
    (nextTwo - nextOne) < (p - nextTwo) + (nextOne - nextThree)){
    return true;
  }
  else{
    return false;
  }
};

var pointInSameTrend = function(i, data, prop) {
  var p = data.get(i).get(prop);
  var nextOne = data.get(i+1).get(prop);
  var nextTwo = data.get(i+2).get(prop);
  var nextThree = data.get(i+2).get(prop);

  return p === nextTwo && nextOne === nextThree;
};

if(window){
  window.turningPoints = turningPoints;
}
else if(module && module.exports){
  module.exports = turningPoints;
}