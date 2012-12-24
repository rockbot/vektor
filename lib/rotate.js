var m = require('./matrix');

// -----------------------------------------------------------
// rotation matrix around the X axis
// -----------------------------------------------------------
exports.RotX = function RotX(theta, isDeg) {
  if (isDeg) theta *= (2 * Math.PI / 360);

  var R = new m(3);

  R.set(0, 0, 1);
  R.set(0, 1, 0);
  R.set(0, 2, 0);

  R.set(1, 0, 0); 
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, -Math.sin(theta));

  R.set(2, 0, 0);
  R.set(2, 1, Math.sin(theta));
  R.set(2, 2, Math.cos(theta));

  return R;
};

// -----------------------------------------------------------
// rotation matrix around the Y axis
// -----------------------------------------------------------
exports.RotY = function RotY(theta, isDeg) {
  if (isDeg) theta *= (2 * Math.PI / 360);

  var R = new m(3);

  R.set(0, 0, Math.cos(theta));
  R.set(0, 1, 0);
  R.set(0, 2, Math.sin(theta));

  R.set(1, 0, 0);
  R.set(1, 1, 1);
  R.set(1, 2, 0);

  R.set(2, 0, -Math.sin(theta));
  R.set(2, 1, 0);
  R.set(2, 2, Math.cos(theta));

  return R;
};

// -----------------------------------------------------------
// rotation matrix around the Z axis
// -----------------------------------------------------------
exports.RotZ = function RotZ(theta, isDeg) {
  if (isDeg) theta *= (2 * Math.PI / 360);

  var R = new m(3);

  R.set(0, 0, Math.cos(theta));
  R.set(0, 1, -Math.sin(theta));
  R.set(0, 2, 0);

  R.set(1, 0, Math.sin(theta));
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, 0);

  R.set(2, 0, 0);
  R.set(2, 1, 0);
  R.set(2, 2, 1);

  return R;
};

module.exports = exports;
