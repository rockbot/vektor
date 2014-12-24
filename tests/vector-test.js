var v = require('../').vector;
var should = require('should');

describe('Creating vectors: ', function () {
  it('Should pass with 3 arguments', function () {
    var a = new v(1,0,0);
    a.v.length.should.eql(3);
    a.v.should.eql([1,0,0]);
  });

  it('Should pass with 2 arguments', function () {
    var a = new v(1,0);
    a.v.length.should.eql(2);
    a.v.should.eql([1,0]);
  });

  it('should pass with 1 argument as an object', function () {
    var a = new v({x: 1, y: 0});
    a.v.length.should.eql(2);
    a.v.should.eql([1,0]);
  });

  it('should pass with 1 argument as an object with x, y, and z values', function () {
    var a = new v({x: 1, y: 0, z: 2});
    a.v.length.should.eql(3);
    a.v.should.eql([1,0,2]);
  });

  it('should pass with 1 argument as a vector', function () {
    var a = new v([1,0]);
    a.v.length.should.eql(2);
    a.v.should.eql([1,0]);
  });
});

var a = new v(1,0,0);
var b = new v(1,1,0);

describe('Vector operations: ', function () {
  it('should scale the vector', function () {
    var c = b.scale(1.5);
    c.v.should.eql([ 1.5, 1.5, 0 ]);
  });
});

describe('Between two vectors: ', function () {
  it('should add two vectors easily', function () {
    var c = a.add(b);
    c.v.length.should.eql(3);
    c.v.should.eql([ 2, 1, 0 ]);
  });

  it('should calculate the dot product', function () {
    var c = a.dot(b);
    c.should.eql(1);
  });

  it('should calculate the cross product', function () {
    var c = a.cross(b);
    c.v.length.should.eql(3);
    c.v.should.eql([0,0,1]);
  });

  it('should calculate the distance between the two', function () {
    var c = a.distanceFrom(b);
    c.should.eql(1);
  });

  it('should calculate the length of the vector', function () {
    var lenA = a.length();
    var lenB = b.length();
    lenA.should.eql(1);
    lenB.should.eql(Math.sqrt(2));
  });

});

describe('moving a vector: ', function () {
  var d;

  beforeEach(function () {
    d = new v(1,1,1);
  });

  it('should move a vector given a point object', function () {
    d.moveTo({x: 2, y: 2, z: 2});
    d.x.should.eql(2);
    d.y.should.eql(2);
    d.z.should.eql(2);
  });

  it('should move a vector given a point array', function () {
    d.moveTo([3,3,3]);
    d.x.should.eql(3);
    d.y.should.eql(3);
    d.z.should.eql(3);
  });
});
