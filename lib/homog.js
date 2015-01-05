var v = require('./vector'),
    m = require('./matrix'),
    Rotate = require('./rotate');

var Homog = function Homog (rot, trans) {
  if (rot === 0) {
    rot = new Rotate.RotX(0);
  }

  if (trans === 0) {
    trans = new v([0, 0, 0]);
  }

  if (rot.cols !== rot.rows || trans.v.length !== rot.cols) {
    throw new Error('Rotation matrix must be square and transform must be of same order as matrix');
  }

  var H = new m(4);

  // fill in the rotation part
  for (var r = 0; r < rot.rows; ++r) {
    for (var c = 0; c < rot.cols; ++c) {
      H.set(r, c, rot.get(r, c));
    }
  }

  // fill in the translation part
  for (var t = 0; t < trans.v.length; ++t) {
    H.set(t, 3, trans.v[t]);
  }


  // add the buffer zone
  if (rot.cols === 2) { // for 2D systems
    H.set(2, 0, 0);
    H.set(2, 1, 0);
    H.set(2, 2, 1);
    H.set(2, 3, 0);
  }

  H.set(3, 0, 0);
  H.set(3, 1, 0);
  H.set(3, 2, 0);
  H.set(3, 3, 1);

  return H;
};

exports = module.exports = Homog;
