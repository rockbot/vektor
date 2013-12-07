var v = require('./vector');

// -----------------------------------------------------------
// Matrices
// -----------------------------------------------------------
var Matrix = function Matrix (rows, cols, isIdentity) {
  // initialize the matrix
  this.rows = rows;
  this.cols = cols ? cols : rows; // make it a square matrix if only one argument

  this.m = new Array(rows);
  for (var r = 0; r < rows; ++r) {
    this.m[r] = new Array(cols);
    for (var c = 0; c < cols; ++c) {
      this.m[r][c] = 0;
    }
  }

  this.isVector = false;

  this.size = {rows: this.rows, cols: this.cols};

};

Matrix.prototype = {
  set : function (i, j, val) {
    this.m[i][j] = parseFloat(val.toFixed(6));
  },

  get : function (i, j) {
    return this.m[i][j];
  },

  add: function (B) {
    if (B.cols !== this.cols || B.rows !== this.rows)
      return new Error('A and B must be the same size');

    var C = new Matrix(this.rows, this.cols);
    for (var r = 0; r < this.rows; ++r) {
      for (var c = 0; c < this.cols; ++c) {
        var val = this.get(r,c) + B.get(r,c);
        C.set(r,c, val);
      }
    }
    return C;
  },

  dot: function (B) {
    if (B.isVector ? B.v.length !== this.cols : B.rows !== this.cols) {
      return new Error('number of cols of A must equal number of rows of B');
    }

    var C;
    if (B.isVector) {
      var arr = Array(B.v.length);
      for (var i = 0; i < B.v.length; ++i) {
        arr[i] = 0;
        for (var j = 0; j < this.rows; ++j) {
          arr[i] += parseFloat((this.get(i,j) * B.v[j]).toFixed(6));
        }
      }
      C = new v(arr);
    } else {
      C = new Matrix(this.rows, B.cols);
      for (var r = 0; r < C.rows; ++r) {
        for (var c = 0; c < C.cols; ++c) {
          var val = 0;
          for (var m = 0; m < B.rows; ++m) {
             val += parseFloat((this.get(r,m) * B.get(m,c)).toFixed(6));
          }
          // console.log(val);
          C.set(r, c, val);
        }
      }

    }
    return C;
  },

  transpose: function() {
    var T = new Matrix(this.rows, this.cols);

    for (var r = 0; r < this.rows; ++r)
    {
      for (var c = 0; c < this.cols; ++c)
      {
        T.m[r][c] = this.m[c][r];
      }
    }
    return T;
  },

  det: function () {
    if (this.rows === 3 && this.cols ===3) {
      var chunk1 = this.m[0][0] * (this.m[1][1] * this.m[2][2] - this.m[1][2] * this.m[2][1]);
      var chunk2 = - this.m[0][1] * (this.m[1][0] * this.m[2][2] - this.m[1][2] * this.m[2][0]);
      var chunk3 = this.m[0][2] * (this.m[1][0] * this.m[2][1] - this.m[1][1] * this.m[2][0]);
      return chunk1 + chunk2 + chunk3;
    }

    if (this.rows === 2 && this.cols === 2) {
      return this.m[0][0] * this.m[1][1] - this.m[0][1] * this.m[1][0];
    }

    return new Error('your matrix is too big or not square or... something');
  },

  getPoint: function () {
    if (this.rows === 4 && this.cols === 4)
      return new v(this.get(0, 3), this.get(1, 3), this.get(2,3));
    else
      return new Error('this is not a homogeneous matrix');
  }
};


exports = module.exports = Matrix;
