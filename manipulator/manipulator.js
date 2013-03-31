var socketio = require('socket.io');
var vektor = require('../lib/vektor');
var five = require('johnny-five');

module.exports = function (server) {
  var io = socketio.listen(server);

  io.set('log level', 1);

  io.sockets.on('connection', function (socket) {
    var linkLengths = [50, 100, 150];
    var joints = [
      {x: 0, y: 0}
      // {x: 100, y: 100},
      // {x: 200, y: 200},
      // {x: 300, y: 300}
    ];

    socket.emit('init', joints);

    socket.on('click', function (pt) {
      joints.push(pt);
      console.log(joints);
      socket.emit('draw', joints);
    });

    var board, array;

    board = new five.Board();

    board.on("ready", function () {
      five.Servo({
        pin: 9,
        range: [0, 170]
      });

      five.Servo({
        pin: 10,
        range: [0, 170]
      });

      array = new five.Servos();
  
      socket.on('slider1', function (val) {
        // console.log('slide1: ', val);
        array[0].move(val);
      });

      socket.on('slider2', function (val) {
        array[1].move(val);
      })
    });

  });
};