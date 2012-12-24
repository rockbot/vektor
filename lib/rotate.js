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
  // R.set(0, 3, 0);

  R.set(1, 0, 0); 
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, -Math.sin(theta));
  // R.set(1, 3, 0);

  R.set(2, 0, 0);
  R.set(2, 1, Math.sin(theta));
  R.set(2, 2, Math.cos(theta));
  // R.set(2, 3, 0);

  R.set(3, 0, 0);
  R.set(3, 1, 0);
  R.set(3, 2, 0);
  // R.set(3, 3, 1);

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
  // R.set(0, 3, 0);

  R.set(1, 0, 0);
  R.set(1, 1, 1);
  R.set(1, 2, 0);
  // R.set(1, 3, 0);

  R.set(2, 0, -Math.sin(theta));
  R.set(2, 1, 0);
  R.set(2, 2, Math.cos(theta));
  // R.set(2, 3, 0);

  // R.set(3, 0, 0);
  // R.set(3, 1, 0);
  // R.set(3, 2, 0);
  // R.set(3, 3, 1);

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
  // R.set(0, 3, 0);

  R.set(1, 0, Math.sin(theta));
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, 0);
  // R.set(1, 3, 0);

  R.set(2, 0, 0);
  R.set(2, 1, 0);
  R.set(2, 2, 1);
  // R.set(2, 3, 0);

  // R.set(3, 0, 0);
  // R.set(3, 1, 0);
  // R.set(3, 2, 0);
  // R.set(3, 3, 1);

  return R;
};

// // -----------------------------------------------------------
// // translation matrix
// // -----------------------------------------------------------
// exports.Trans = function Trans(x,y,z)
// {
//   var R = new m(4);

//   R.set(0, 0, 1);
//   R.set(0, 1, 0);
//   R.set(0, 2, 0);
//   R.set(0, 3, x);

//   R.set(1, 0, 0);
//   R.set(1, 1, 1);
//   R.set(1, 2, 0);
//   R.set(1, 3, y);

//   R.set(2, 0, 0);
//   R.set(2, 1, 0);
//   R.set(2, 2, 1);
//   R.set(2, 3, z);

//   R.set(3, 0, 0);
//   R.set(3, 1, 0);
//   R.set(3, 2, 0);
//   R.set(3, 3, 1);

//   return R;
// };

// // -----------------------------------------------------------
// // rotate a vector about a defined origin by angles
// // zRotAng (yaw), yRotAng (pitch), xRotAng (roll)
// // -----------------------------------------------------------
// function RotVectorAboutOrigin(vector, origin, rotAngles, on)
// {
//   var T = Trans(-origin.v[0], -origin.v[1], -origin.v[2]);
//   var R = MultiplyMatrices( MultiplyMatrices(RotZ(rotAngles[0]), RotY(rotAngles[1])), RotX(rotAngles[2]) );
//   var Trev = Trans(origin.v[0], origin.v[1], origin.v[2]);

//   var TRTrev = MultiplyMatrices( Trev, MultiplyMatrices(R, T) );
//   if (on)
//   {
//     return TRTrev.multiplyByVector(vector.v);
//   }

//   return TRTrev.multiplyByVector(vector);
// }

module.exports = exports;
