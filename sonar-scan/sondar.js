var socketio = require('socket.io'),
    five = require('johnny-five'),
    array = require('array-extended'),
    temporal = require('temporal');
    // ds = require('dualshock-controller')();

module.exports = function (server) {

  var io = socketio.listen(server);
  io.set('log level', 1);

  io.sockets.on('connection', function (socket) {

      console.log('boom1')
    var board, sServo, range, lServo, rServo;

    board = new five.Board({
      port: '/dev/tty.usbserial-AH00156H'
    });
    range = [15, 165];

    board.on("ready", function () {
      console.log('boom2')
      rServo = new five.Servo({
        pin: 10,
        type: 'continuous'
      });
      lServo = new five.Servo({
        pin: 11,
        type: 'continuous'
      });
      sServo = new five.Servo({
        pin: 12,
        range: range
      });
      sonar = new five.Sonar({
        pin: 'A2',
        freq: 20
      });

      lServo.stop();
      rServo.stop();

      sServo.move(15);
      var angle = 15,
          sonarStep = 10,
          moveSpeed = 0.1,
          moveTimeout = 500;

      // ds.on('r2:pressed', function () {
      //   console.log(sonar.cm);
      // });
      // ds.on('l2:pressed', function () {
      //   angle = (range[0] + range[1]) / 2;
      //   sServo.center();
      // });
      // ds.on('dPadLeft:pressed', function () {
      //   angle = angle < range[0] ? range[0] : angle + sonarStep;
      //   sServo.move(angle);
      // });
      // ds.on('dpadRight:pressed', function () {
      //   angle = angle > range[1] ? range[1] : angle - sonarStep;
      //   sServo.move(angle);
      // });
      // ds.on('dpadUp:pressed', function () {
      //   angle = range[1];
      //   sServo.max();
      // });
      // ds.on('dpadDown:pressed', function () {
      //   angle = range[0];
      //   sServo.min();
      // });

      function stop() {
        lServo.stop();
        rServo.stop();
      }

      function turn (rightOn, leftOn, timeout) {
        if (rightOn) {
          rServo.cw(moveSpeed);
        } else {
          rServo.ccw(moveSpeed);
        }

        if (leftOn) {
          lServo.ccw(moveSpeed);
        } else {
          lServo.cw(moveSpeed);
        }

        if (timeout) {
          setTimeout(stop, timeout);
        }
      }

      function turnLeft (timeout) {
        turn (false, true, timeout);
      }

      function turnRight (timeout) {
        turn (true, false, timeout);
      }

      function goStraight (timeout) {
        turn (true, true, timeout);
      }

      function goBack (timeout) {
        turn (false, false, timeout);
      }

      socket.on('fwd', function () {
        goStraight();
      })
      socket.on('back', function () {
        goBack();
      })
      socket.on('right', function () {
        turnRight();
      })
      socket.on('left', function () {
        turnLeft();
      })
      socket.on('stop', function () {
        stop();
      })

      // ds.on('square:pressed', function (data) {
      //   turnLeft();
      // });

      // ds.on('square:release', function (data) {
      //   stop();
      // });

      // ds.on('circle:pressed', function (data) {
      //   turnRight();
      // });

      // ds.on('circle:release', function (data) {
      //   stop();
      // });

      // ds.on('triangle:pressed', function () {
      //   goStraight();
      // });

      // ds.on('triangle:release', function (data) {
      //   stop();
      // });

      // ds.on('x:pressed', function () {
      //   goBack();
      // });

      // ds.on('x:release', function (data) {
      //   stop();
      // });

      var scanSpot = function (cb) {
        var sServoReadings = [];
        var read = setInterval(function () {
          sServoReadings.push(sonar.cm);
          if (sServoReadings.length === 10) {
            clearInterval(read);
            console.log(array.avg(sServoReadings));
            cb(null, array.avg(sServoReadings));
          }
        }, 100);
      }

      // ds.on('select:pressed', function () {
      //   console.log('IN AUTO MODE');
      //   // scan box
      //   var minVal = 0;
      //   while (minVal < 30) {
      //     console.log('boom?');
      //   // board.loop(5000, function () { 
      //     var scans = [];
      //     temporal.queue([
      //       {
      //         delay: 0,
      //         task: function () {
      //           sServo.max();
      //           scanSpot(function (err, val) {
      //             scans.push({dir: 'left', val: val})
      //             // left = val;
      //             // console.log('left: ', val);
      //           });
      //         }
      //       },
      //       {
      //         delay: 1500,
      //         task: function () {
      //           sServo.center();
      //           scanSpot(function (err, val) {
      //             scans.push({dir: 'center', val: val})
      //             // center = val;
      //             // console.log('center: ', val);
      //           });
      //         }
      //       },
      //       {
      //         delay: 1500,
      //         task: function () {
      //           sServo.min();
      //           scanSpot(function (err, val) {
      //             scans.push({dir: 'right', val: val})
      //             // right = val;
      //             // console.log('right: ', val);
      //           });
      //         }
      //       },
      //       {
      //         delay: 1500,
      //         task: function () {
      //           // console.log(left, center, right);
      //           minVal = array.min(scans, 'val').val;
      //           var maxVal = array.max(scans, 'val');
      //           console.log(maxVal);
      //           var direction = maxVal.val > 30 ? maxVal.dir : 'right';
      //           console.log(direction);
      //           if (direction === 'center') {
      //             goStraight(750);
      //           } else if (direction === 'left') {
      //             turnLeft(750);
      //           } else {
      //             turnRight(750);
      //           }
      //         }
      //       }
      //     ])
      //   }
      // });

    });
    // });
    // ds.connect();
    // };
  })
}