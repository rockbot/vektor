// -----------------------------------------------------------
// Vectors
// -----------------------------------------------------------
var Vector = function Vector (x, y, z) {
  if (typeof y === 'undefined' && typeof z === 'undefined') {
    if (typeof x.x != 'undefined') {
      this.x = x.x;
      this.y = x.y;
      this.z = definedValueOrZero(x.z);
    } else {
      this.x = x[0];
      this.y = x[1];
      this.z = definedValueOrZero(x[2]);
    }
  } else {
    this.x = x;
    this.y = y;
    this.z = definedValueOrZero(z);
  }

  this.v = [this.x, this.y, this.z];
};

var definedValueOrZero = function(value) {
    return typeof value !== 'undefined' ? value : 0;
}

Vector.prototype = {
  isVector: true,

  add: function (b) {
    return new Vector(this.x + b.x, this.y + b.y, this.z + b.z);
  },

  dot: function (b) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  },

  cross: function (b) {
    var i = this.y * b.z - this.z * b.y;
    var j = this.z * b.x - this.x * b.z;
    var k = this.x * b.y - this.y * b.x;
    return new Vector(i, j, k);
  },

  moveTo: function(pt) {
    var v = new Vector(pt);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  },

  distanceFrom: function (b) {
    return length([this.x - b.x, this.y - b.y, this.z - b.z]);
  },

  length: function () {
    return length(this.v);
  }
};

var length = function length(elements) {
  var sumOfSquares = 0;
  for (var index = 0; index < elements.length; index++) {
    sumOfSquares += elements[index] * elements[index]
  }
  return Math.sqrt(sumOfSquares);
}
exports = module.exports = Vector;
