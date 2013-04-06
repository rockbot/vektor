var socketio = require('socket.io');
var vektor = require('../lib/vektor');
var h = vektor.homog;
var v = vektor.vector;
var r = vektor.rotate;
var five = require('johnny-five');

module.exports = function (server) {
  var io = socketio.listen(server);

  io.set('log level', 1);


  function setJoints (angles, origin) {
    var joints = [];
    var T = h(r.RotZ(-Math.PI/2), origin);
    var T1 = T.dot(h(r.RotZ(angles[0]), 0));

    var T2 = T1.dot(h(r.RotZ(angles[1]), new v([100,0,0])));
    var T3 = T2.dot(h(r.RotZ(angles[2]), new v([100,0,0])));

    joints.push(T1.getPoint());
    joints.push(T2.getPoint());
    joints.push(T3.getPoint());
    return joints;
  }

  io.sockets.on('connection', function (socket) {
    // var board, array;
    // board = new five.Board();

    var origin = new v([100, 250, 0]);

    var angles = [0, 0, 0];

    socket.emit('init', setJoints(angles, origin));

    // socket.on('click', function (pt) {
    //   joints.push(pt);
    //   console.log(joints);
    //   socket.emit('draw', joints);
    // });

    // board.on("ready", function () {
    //   five.Servo({
    //     pin: 9,
    //     range: [0, 170]
    //   });

    //   five.Servo({
    //     pin: 10,
    //     range: [0, 170]
    //   });

    //   array = new five.Servos();
  
      socket.on('slider1', function (val) {
        // console.log('slide1: ', val);
        // array[0].move(val);
        angles[0] = val * Math.PI / 180;
        socket.emit('draw', setJoints(angles, origin));
      });

      socket.on('slider2', function (val) {
        // array[1].move(val);
        angles[1] = val * Math.PI / 180;
        socket.emit('draw', setJoints(angles, origin));
      })
    // });

  });
};