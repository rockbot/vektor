var socketio = require('socket.io');
var vektor = require('../lib/vektor');

module.exports = function (server) {
  var io = socketio.listen(server);

  io.set('log level', 1);

  io.sockets.on('connection', function (socket) {
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
  });
};