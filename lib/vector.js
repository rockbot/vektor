// -----------------------------------------------------------
// Vectors
// -----------------------------------------------------------
var Vector = function Vector (x, y, z) {
  if (typeof y === 'undefined' && typeof z === 'undefined') {
    this.x = typeof x.x !== 'undefined' ? x.x : x[0];
    this.y = typeof x.y !== 'undefined' ? x.y : x[1];
    this.z = typeof x.z !== 'undefined' ? x.z : x[2];
  } else {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  this.v = typeof this.z !== 'undefined' ? [this.x, this.y, this.z] : [this.x, this.y];

};

Vector.prototype = {
  add: function (b) {
    return new Vector(this.x + b.x, this.y + b.y, this.z + b.z);
  },

  dot: function (b) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  },

  isVector: true,

  moveTo: function(pt) {
    this.x = typeof pt.x !== 'undefined' ? pt.x : pt[0];
    this.y = typeof pt.y !== 'undefined' ? pt.y : pt[1];
    this.z = typeof pt.z !== 'undefined' ? pt.z : pt[2];
  },
  cross: function (b) {
    var i = this.y * b.z - this.z * b.y;
    console.log(i);
    var j = this.z * b.x - this.x * b.z;
    console.log(j);
    var k = this.x * b.y - this.y * b.x;
    console.log(k);
    return new Vector(i, j, k);
  },

  distanceFrom: function (b) {
    var sumOfSquares = 0;
    for (var i = 0; i < this.v.length; ++i) {
      sumOfSquares += (this.v[i] - b.v[i]) * (this.v[i] - b.v[i]);
    }

    return Math.sqrt(sumOfSquares);

  },

  length: function () {
    var sumOfSquares = 0;
    for (var i = 0; i < this.v.length; ++i) {
      sumOfSquares += this.v[i] * this.v[i];
    }
    return Math.sqrt(sumOfSquares)
  }
};

exports = module.exports = Vector;
