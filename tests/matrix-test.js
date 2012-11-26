var Matrix = require('../').matrix;
var Vector = require('../').vector;
var should = require('should');

describe('Creating matrices: ', function () {
  it('should create a Matrix', function (done) {
    var A = new Matrix(3,4);
    done();
  });

  var A = new Matrix(2,2);
  var B = new Matrix(2,2);

  it('should set a specific value', function (done) {
    // var A = new Matrix(3,4);
    A.set(0,0,1);
    A.set(1,1,1);
    A.m[1][1].should.eql(1);
    done();
  });

  it('should get the value at a specific location', function (done) {
    A.get(1,1).should.eql(1);
    done();
  });

  it('should add the two matrices together', function (done) {
    B.set(0,0,2);
    B.set(1,0,1);
    var C = A.add(B);
    C.get(0,0).should.eql(3);
    done();
  });

  it('should multiply a vector by a matrix', function (done) {
    var v = new Vector(2,3);
    var C = A.dot(v);
    C.v.should.eql([2,3]);
    done();
  });

  it('should multiply two matrices together', function (done) {
    var C = A.dot(B);
    C.get(0,0).should.eql(2);
    done();
  });

  it('should find the transpose of the matrix', function (done) {
    A.set(1,0,2);
    var B = A.transpose();
    B.get(0,1).should.eql(2);
    done();
  });
});