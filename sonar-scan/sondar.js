var socketio = require('socket.io'),
    vektor = require('../lib/vektor'),
    h = vektor.homog,
    v = vektor.vector,
    r = vektor.rotate,
    five = require('johnny-five'),
    _ = require('underscore')._;

module.exports = function (server) {
  var ORIGIN = new v([250, 450, 0]);

  function transformPoint (ang, dist) {
    var T, T1;
        T = h(r.RotZ(Math.PI), ORIGIN),
        T1 = T.dot(h(0, new v([dist*Math.cos(ang * Math.PI/180),dist*Math.sin(ang * Math.PI/180),0])));

    return T1.getPoint().v;
  }

  var io = socketio.listen(server);
  io.set('log level', 1);
  
  io.sockets.on('connection', function (socket) {

    socket.emit('start', transformPoint(0, 0));

    var board, servo, range, scanLeft = true;

    board = new five.Board();
    range = [15, 165];

    board.on("ready", function () {
      this.debug = false;
      servo = new five.Servo({
        pin: 12,
        range: range
      });
      sonar = new five.Sonar({
        pin: 'A2',
        freq: 20
      });

      board.repl.inject({
        servo: servo,
        sonar: sonar
      });

      servo.move(15);
      var angle = 15;

      this.loop(120, function () {
        var step = 1, 
            info, meas;
        if (angle < range[0] + step) scanLeft = true;
        if (angle > range[1] - step) scanLeft = false;

        angle = scanLeft ? angle + step : angle - step;

        servo.move(180 - angle);
        meas = sonar.cm;
        info = {angle: angle, pt: transformPoint(angle, meas), step: step};

        socket.emit('move', info);
        console.log('servo: ', angle, 'sonar: ', sonar.cm);
      });
    });
  });
};
