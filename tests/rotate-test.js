var Vector = require('../').vector;
var Rotate = require('../').rotate;
var should = require('should');

var v = new Vector([1,0,0]);

describe('Rotating a point about the z-axis', function () {
  it('should rotate it by pi/2 radians', function () {
    var M = new Rotate.RotZ(Math.PI/2);
    M.dot(v).v.should.eql([0,1,0]);
  });
  it('should rotate it by 90 degrees', function () {
    var M = new Rotate.RotZ(90, true);
    M.dot(v).v.should.eql([0,1,0]);
  });
});

describe('Rotating a point about the y-axis', function () {
  it('should rotate it by pi/2 radians', function () {
    var M = new Rotate.RotY(Math.PI/2);
    M.dot(v).v.should.eql([0, 0, -1]);
  });
});

describe('Rotating a point about the x-axis', function () {
  it('should rotate it by pi/2 radians', function () {
    var M = new Rotate.RotX(Math.PI/2);
    M.dot(v).v.should.eql([1, 0, 0]);
  });
});