'use strict';

var PipItem = function(index, parent) {
    this.cache = +Infinity;
    this.value = null;
    this.index = index;
    this.order = 0;
    this.prev = null;
    this.next = null;
    this.parent = parent;
}

PipItem.prototype.updateCache = function() {
    if (this.prev == null || this.next == null)
        this.cache = +Infinity;
    else
        this.cache = this.parent.distance(this.prev.value, this.value, this.next.value);
    this.parent.notifyChange(this.index);
}

PipItem.prototype.putAfter = function(tail) {
    if (tail != null) {
        tail.next = this;
        tail.updateCache();
    }
    this.prev = tail;
    this.updateCache();
    return this;
}

PipItem.prototype.recycle = function() {
    if (this.prev != null) {
        this.prev.next = this.next;
        this.prev.updateCache();
    } else {
        this.parent.head = this.next;
    }

    if (this.next != null) {
        this.next.prev = this.prev;
        this.next.updateCache();
    } else {
        this.parent.tail = this.prev;
    }

    return this.clear();
}

PipItem.prototype.clear = function() {
    this.order = 0;
    this.next = null;
    this.prev = null;
    this.cache = +Infinity;

    var ret = this.value;
    this.value = null;
    return ret;
}

var PipHeap = function(distance) {
  this.distance = distance;
  this.heap = this.createHeap(512);
  this.tail = this.head = null;
  this.size = 0;
  this.globalOrder = 0;
};

PipHeap.prototype.createHeap = function(n) {
    var list = new Array(n);
    for(var i=0; i < n; i++)
        list[i] = new PipItem(i, this);
    return list;
};

PipHeap.prototype.ensureHeap = function(newSize) {
    while (this.heap.length <= newSize)
        this.heap.push(new PipItem(this.heap.length, this));
};

PipHeap.prototype.acquireItem = function(value){
    this.ensureHeap(this.size);
    var item = this.heap[this.size];
    item.value = value;
    item.order = this.globalOrder++;
    this.size++;
    return item;
};

PipHeap.prototype.add = function(value) {
    this.tail = this.acquireItem(value).putAfter(this.tail);
    if (this.head == null)
        this.head = this.tail;
};

PipHeap.prototype.minValue = function() {
    return heap[0].cache;
};

PipHeap.prototype.removeMin = function() {
    return this.removeAt(0);
};

PipHeap.prototype.removeAt = function(idx) {
    this.swap(idx, --this.size);
    this.bubbleDown(idx);
    return this.heap[this.size].recycle();
};

PipHeap.prototype.notifyChange = function(idx) {
    return this.bubbleDown(this.bubbleUp(idx));
};

PipHeap.prototype.bubbleUp = function(n) {
    while (n!=0 && this.less(n, (n - 1) >> 1))
        n = this.swap(n, (n - 1) >> 1);

    return n;
};

PipHeap.prototype.bubbleDown = function(n) {
    for (var k; (k = this.min3(n, n * 2 + 1, n * 2 + 2)) != n && k < this.size; )
        n = this.swap(n, k);

    return n;
};

PipHeap.prototype.min3 = function(i, j, k) {
    return this.min2(i, this.min2(j, k));
};

PipHeap.prototype.min2 = function(i, j) {
    return this.less(i, j) ? i : j;
};

PipHeap.prototype.less = function(i, j) {
    var heap = this.heap;
    return i < this.size && (j >= this.size ||
            (heap[i].cache != heap[j].cache ?
                    heap[i].cache < heap[j].cache :
                    heap[i].order < heap[j].order));
};

PipHeap.prototype.swap = function(i, j) {
    this.heap[i].index = j;
    this.heap[j].index = i;
    var tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
    return j;
};

PipHeap.prototype.toList = function() {
    var current = this.head;
    var list = [];
    while(current!=null) {
        list.push(current.value);
        current = current.next;
    }
    return list;
};

var createVerticalDistance = function(x, y){
  return function(a, b, c){
    return verticalDistance(a, b, c, x, y);
  };
};

var verticalDistance = function(a, b, c, x, y){
  var resp = Math.abs(((a.get(y) + (c.get(y) - a.get(y)) * (b.get(x) - a.get(x)) /
                          (c.get(x) - a.get(x)) - b.get(y))) *
                (c.get(x) - a.get(x)))
  if (isNaN(resp))
      return -Infinity;
  return resp;
};

var pip = function(data, k, xProp, yProp) {
  var heap = new PipHeap(createVerticalDistance(xProp, yProp));

  for(var i = 0; i < data.count(); i++) {
    heap.add(data.get(i));
    if (heap.size <= k)
      continue;

    heap.removeMin();
  }
  return heap.toList();
};

if(typeof window !== 'undefined'){
  window.pip = pip;
}
else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = pip;
}
