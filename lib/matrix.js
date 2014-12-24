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

  //square matrices can be declared as identities:
  if(this.rows === this.cols && isIdentity){
    for(var i = 0; i<this.rows; i++)
      this.m[i][i] = 1;
  }

  this.isVector = false;

  this.size = {rows: this.rows, cols: this.cols};

};

Matrix.prototype = {
  set : function (i, j, val) {
    this.m[i][j] = parseFloat(val.toFixed(12));
  },

  setRow: function (i, vals) {
    var me = this;
    vals.forEach(function (v, j) {
      me.set(i, j, v);
    });
  },

  get : function (i, j) {
    return this.m[i][j];
  },

  scale: function (a) {
    var C = new Matrix(this.rows, this.cols);
    for (var r = 0; r < this.rows; ++r) {
      for (var c = 0; c < this.cols; ++c) {
        var val = this.get(r,c) * a;
        C.set(r,c, val);
      }
    }
    return C;
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
          arr[i] += parseFloat((this.get(i,j) * B.v[j]).toFixed(12));
        }
      }
      C = new v(arr);
    } else {
      C = new Matrix(this.rows, B.cols);
      for (var r = 0; r < C.rows; ++r) {
        for (var c = 0; c < C.cols; ++c) {
          var val = 0;
          for (var m = 0; m < B.rows; ++m) {
             val += parseFloat((this.get(r,m) * B.get(m,c)).toFixed(12));
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

    for (var r = 0; r < this.rows; ++r) {
      for (var c = 0; c < this.cols; ++c) {
        T.m[r][c] = this.m[c][r];
      }
    }
    return T;
  },

  cofactorDet: function () {
    if (this.rows !== this.cols) {
      throw new Error('this is not a square matrix');
    }

    var det = 0;
    var f = 1;
    for (var i = 0; i < this.rows; i++) {
      det += this.m[0][i] * this.minor(i, 0).det() * f;
      f = -f;
    }

    return det;
  },

  minor: function (k, l) {
    var M = this.copy();

    M.removeRow(l);
    M.removeCol(k);

    return M;
  },

  copy: function () {
    var M = new Matrix(this.rows, this.cols);
    for(var i = 0; i < this.rows; i++) {
      for(var j = 0; j < this.cols; j++) {
        M.set(i, j, this.get(i, j));
      }
    }

    return M;
  },

  removeRow: function (r) {
    this.m.splice(r, 1);
    this.rows -= 1;
  },

  removeCol: function (c) {
    for (var i = 0; i < this.rows; i++) {
      this.m[i].splice(c, 1);
    }
    this.cols -= 1;
  },

  det: function () {
    var A, detA, detL, iter, L, l, row;

    if (this.rows !== this.cols) {
      throw new Error('this is not a square matrix');
    }

    if (this.rows === 2 && this.cols === 2) {
      return this.m[0][0] * this.m[1][1] - this.m[0][1] * this.m[1][0];
    }

    //try a Doolittle extraction for nxn, will bail out to cofactor calculation as necessary
    // zeroth iteration:
    A = this;
    L = new Matrix(this.rows, this.cols, true);
    l = new Matrix(this.rows, this.cols);

    for (iter = 1; iter < this.rows; iter++) {
      // construct this iteration's lower triangular matrix:
      l = new Matrix(this.rows, this.cols, true);
      for (row = iter; row < this.rows; row++) {
        if(A.m[iter - 1][iter - 1] === 0)
          //bail out to the brute force calculation
          return this.cofactorDet()
        l.m[row][iter - 1] = -1 * A.m[row][iter - 1] / A.m[iter - 1][iter - 1];
        L.m[row][iter - 1] = -1 * l.m[row][iter - 1];
      }

      // update A:
      A = l.dot(A);
    }

    detA = 1;
    detL = 1;
    for (iter = 0; iter < this.rows; iter++) {
      detA = detA * A.m[iter][iter];
      detL = detL * L.m[iter][iter];
    }

    return detA * detL;
  },

  trace: function () {
    if (this.rows !== this.cols)
      return new Error('this is not a square matrix');

    var trace = 0;
    for (var r = 0; r < this.rows; ++r) {
      trace += this.m[r][r];
    }

    return trace;
  },

  getPoint: function () {
    if (this.rows === 4 && this.cols === 4)
      return new v(this.get(0, 3), this.get(1, 3), this.get(2,3));
    else
      return new Error('this is not a homogeneous matrix');
  },

  getRot: function () {
    if (this.rows === 4 && this.cols === 4) {
      var C = new Matrix(3, 3);
      for (var r = 0; r < 3; ++r) {
        for (var c = 0; c < 3; ++c) {
          var val = this.get(r,c);
          C.set(r,c, val);
        }
      }
      return C;
    }
  },

  calcRotAng: function () {
    return Math.acos((this.getRot().trace() - 1)/2);
  },

  calcRotVec: function () {
    var rotMat = this.getRot();
    var rotAng = this.calcRotAng();
    var negRT = rotMat.scale(-1).transpose();
    var skewR = rotMat.add(negRT).scale(1/(2 * Math.sin(rotAng)));

    return new v(-skewR.get(1,2), skewR.get(0,2), -skewR.get(0,1));
  }
};


exports = module.exports = Matrix;
