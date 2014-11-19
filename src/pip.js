'use strict';

var PipHeap = function(distance){
  this.distance = distance;
  this.heap = [];
};

PipHeap.prototype.add = function(value){
  this.heap.push(value);
};

PipHeap.prototype.removeMin = function() {
  var value = +Infinity;
  var index = 0;
  for (var i = 1; i < this.heap.length - 1; i++) {
    var newValue = this.distance(this.heap[i - 1], this.heap[i], this.heap[i + 1]);
    if (newValue < value) {
      value = newValue;
      index = i;
    }
  }
  return this.heap.splice(index, 1)[0];
};

PipHeap.prototype.size = function() {
  return this.heap.length;
};

var createVerticalDistance = function(x, y){
  return function(a, b, c){
    return verticalDistance(a, b, c, x, y);
  };
};

var verticalDistance = function(a, b, c, x, y){
  return Math.abs(((a.get(y) + (c.get(y) - a.get(y)) * (b.get(x) - a.get(x)) /
                          (c.get(x) - a.get(x)) - b.get(y))) *
                (c.get(x) - a.get(x)));
};

var pip = function(data, k, xProp, yProp) {
  var heap = new PipHeap(createVerticalDistance(xProp, yProp));

  for(var i = 0; i < data.count(); i++) {
    heap.add(data.get(i));
    if (heap.size() <= k)
      continue;

    heap.removeMin();
  }
  return heap.heap;
};

if(typeof window !== 'undefined'){
  window.pip = pip;
}
else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = pip;
}

