// [RDV 5/26/13] at some point, this should probably be its own module... but for now, we'll roll with it :)

var socketio = require('socket.io'),
    vektor = require('../lib/vektor'),
    h = vektor.homog,
    v = vektor.vector,
    r = vektor.rotate,
    five = require('johnny-five'),
    _ = require('underscore')._;

module.exports = function (server) {
  var io = socketio.listen(server);
  io.set('log level', 1);
  
  var LINK_LENGTHS = [100, 100],
      MAX_LENGTH = 200,
      ORIGIN = new v([250, 50, 0]),
      endEff;

  function setJoints (angles) { // forward kinematics
    var degs = _.map(angles, function (ang) {
      return ang * 180 / Math.PI;
    });
    // console.log('rads: ', angles, ' degs: ', degs)

    var joints = [],
        T = h(r.RotX(0), ORIGIN),
        T1 = T.dot(h(r.RotZ(angles[0]), 0)),
        T2 = T1.dot(h(r.RotZ(angles[1]), new v([LINK_LENGTHS[0],0,0]))),
        T3 = T2.dot(h(0, new v([LINK_LENGTHS[1],0,0])));

    endEff = T3.getPoint();

    joints.push(T1.getPoint(), T2.getPoint(), endEff);

    return joints;
  }

  io.sockets.on('connection', function (socket) {
    var deg2rad = Math.PI / 180,
        rad2deg = 180 / Math.PI;
    
    var angles = [10 * deg2rad, 0 * deg2rad];

    socket.emit('init', setJoints(angles, ORIGIN)); // forward kinematics

    // set up the board and servos
    // var board, array;
    // board = new five.Board();
    // board.on("ready", function () {
    //   five.Servo({
    //     pin: 9
    //   , range: [10, 170]
    //   });

    //   five.Servo({
    //     pin: 10
    //   , range: [10, 170]
    //   });

    //   array = new five.Servos();
    //   this.repl.inject({
    //       array: array
    //     });
    //   array[0].move(0);
    //   array[1].center();
  
      socket.on('slider1', function (val) {
        // console.log('slide1: ', val);
        // array[0].move(val);
        angles[0] = val * deg2rad;
        socket.emit('draw', setJoints(angles)); // forward kinematics
      });

      socket.on('slider2', function (val) {
        // console.log(val, parseInt(val, 10)+90)
        // array[1].move(parseInt(val, 10) + 90);
        angles[1] = val * deg2rad;
        socket.emit('draw', setJoints(angles)); // forward kinematics
      });

      socket.on('click', function (pt) { // inverse kinematics
        var pt_v = new v(pt);
        var distToEE = pt_v.distanceFrom(endEff);
        
        var x = pt.x - ORIGIN.x,
            y = pt.y - ORIGIN.y,
            x_sq = x * x,
            y_sq = y * y,
            l1 = LINK_LENGTHS[0],
            l2 = LINK_LENGTHS[1],
            l1_sq = l1 * l1,
            l2_sq = l2 * l2,
            th1, th2, cth2, sth2;

        // ignore any attempts to move the arm outside of its own physical boundaries
        if (Math.sqrt(x_sq + y_sq) > MAX_LENGTH || y < 0) {
          return false; 
        }

        // value of th2 from http://www.cescg.org/CESCG-2002/LBarinka/paper.pdf
        th2 = angles[1] = Math.acos( (x_sq + y_sq - l1_sq - l2_sq) / (2 * l1 * l2) );

        cth2 = Math.cos(th2);
        sth2 = Math.sin(th2);

        // value of th1 from www.site.uottawa.ca/~petriu/generalrobotics.org-ppp-Kinematics_final.ppt‎
        th1 = angles[0] = Math.asin((y * (l1 + l2 * cth2) - x * l2 * sth2) / (x_sq + y_sq));

        socket.emit('setSlide', angles);

        socket.emit('draw', setJoints(angles))
      //   array[0].move(angles[0] * rad2deg);
      //   array[1].move(angles[1] * rad2deg + 90);
      // });
    });

  });
};