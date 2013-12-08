var Vector = require('../').vector;
var Rotate = require('../').rotate;
var Homog = require('../').homog;
var should = require('should');

var Matrix = require('../').matrix;

describe('Create a homogenous matrix', function () {
  it('rotating about the z-axis by pi/2 radians', function (done) {
    var Rz = new Rotate.RotZ(Math.PI/2);
    var H1 = new Homog(Rz, 0);
    H1.m.should.eql([[0, -1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
    done();
  });
  it('rotating about the z-axis by pi/2 radians and translating by [1, 0, 0]', function (done) {
    var Rz = new Rotate.RotZ(Math.PI/2);
    var H1 = new Homog(Rz, new Vector([1, 0, 0]));
    H1.m.should.eql([[0, -1, 0, 1], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
    done();
  });
  it('rotating about the z-axis by pi/2 radians and the y-axis by pi/4 and translating by [1, 0, 0]', function (done) {
    var Rz = new Rotate.RotZ(Math.PI/2);
    var Ry = new Rotate.RotY(Math.PI/4);
    var H1 = new Homog(Rz, 0);
    var H2 = new Homog(Ry, 0);
    var H3 = new Homog(0, new Vector(1, 0, 0));
    var H2_1 = H3.dot(H2.dot(H1));
    var s2_2 = parseFloat((Math.sqrt(2) / 2).toFixed(6));
    H2_1.m.should.eql([[0, -s2_2, s2_2, 1], [1, 0, 0, 0], [0, s2_2, s2_2, 0], [0, 0, 0, 1]]);
    done();
  });
  it('get the location of the transformed point', function (done) {
    var Rz = new Rotate.RotZ(Math.PI/2);
    var H1 = new Homog(Rz, new Vector([1, 0, 0]));
    H1.getPoint().v.should.eql([1,0,0]);
    done();
  });
  it('gets the rotation matrix', function (done) {
    var Rz = new Rotate.RotZ(Math.PI/2);
    var H1 = new Homog(Rz, new Vector([1, 0, 0]));
    H1.getRot().should.eql(Rz);
    done();
  });
  it('should get the angle of rotation', function (done) {
    var Rz = new Rotate.RotZ(Math.PI/2);
    var H1 = new Homog(Rz, new Vector([1, 0, 0]));
    H1.calcRotAng().should.eql(Math.PI/2);
    done();
  });
  it('should get the vector of rotation', function (done) {
    var Rz = new Rotate.RotZ(Math.PI/2);
    var H1 = new Homog(Rz, new Vector([1, 0, 0]));
    H1.calcRotVec().should.eql(new Vector(0, 0, 1));
    done();
  });
});
