var Vector = require('../').vector;
var Rotate = require('../').rotate;
var should = require('should');

describe('Rotating a point about the z-axis', function () {
  it('should rotate it by pi/2 radians', function (done) {
    var v = new Vector([1,0,0]);
    var M = new Rotate.RotZ(Math.PI/2);
    M.dot(v).v.should.eql([0,1,0]);
    done();
  });
  it('should rotate it by 90 degrees', function (done) {
    var v = new Vector([1,0,0]);
    var M = new Rotate.RotZ(90, true);
    M.dot(v).v.should.eql([0,1,0]);
    done();
  });
});

describe('Rotating a point about the y-axis', function () {
  it('should rotate it by pi/2 radians', function (done) {
    var v = new Vector([1,0,0]);
    var M = new Rotate.RotY(Math.PI/2);
    M.dot(v).v.should.eql([0, 0, -1]);
    done();
  });
});