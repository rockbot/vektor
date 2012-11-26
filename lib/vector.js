// -----------------------------------------------------------
// Vectors
// -----------------------------------------------------------
var Vector = function Vector (x, y, z) {
  if (typeof y === 'undefined' && typeof z === 'undefined') {
    this.x = x.hasOwnProperty('x') ? x.x : x[0];
    this.y = x.hasOwnProperty('y') ? x.y : x[1];
    this.z = x.hasOwnProperty('z') ? x.z : x[2];
  } else {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  this.v = typeof z !== 'undefined' ? [this.x, this.y, this.z] : [this.x, this.y];

};

Vector.prototype = {
  add: function (b) {
    return [this.x + b.x, this.y + b.y, this.z + b.z];
  },

  dot: function (b) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  },

  isVector: true,

  moveTo: function(pt) {
    this.x = pt.hasOwnProperty('x') ? pt.x : pt[0];
    this.y = pt.hasOwnProperty('y') ? pt.y : pt[1];
    this.z = pt.hasOwnProperty('z') ? pt.z : pt[2];
  },
  // cross: function (b) {
  //   var i = y * b.z - z * b.y;
  //   console.log(i);
  //   var j = z * b.x - x * b.z;
  //   console.log(j);
  //   var k = x * b.y - y * b.x;
  //   console.log(k);
  //   return [i, j, k];
  // },

  distanceFrom: function (b) {
    var sumOfSquares = 0;
    for (var i = 0; i < this.v.length; ++i) {
      sumOfSquares += (this.v[i] - b.v[i]) * (this.v[i] - b.v[i]);
    }

    return Math.sqrt(sumOfSquares);

  }
};

exports = module.exports = Vector;


