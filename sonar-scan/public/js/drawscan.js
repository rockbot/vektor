var canvas = document.getElementById("scan"),
    ctx = canvas.getContext("2d"),
    socket = io.connect('http://' + window.location.hostname),
    ranges = Array(165),
    deg2rad = Math.PI / 180;

var CANVAS_WIDTH = 500,
    CANVAS_HEIGHT = 500,
    ROBOT_ORIGIN = [250, 450];

socket.on('move', function (info) {
  // console.log(info)
  ranges[info.angle/info.step] = info.pt;
  // console.log(ranges);
  drawPoints(info.angle);
});

socket.on('start', function (origin) {
  for (var i = 0; i < ranges.length; ++i) { ranges[i] = 0; }
  // drawPoint(origin, '#00f');
})

function drawPoint (v, color) {
  ctx.fillStyle = color || '#000';
  ctx.beginPath();
  ctx.arc(v[0], v[1], 2, 0, Math.PI*2, 0);
  ctx.fill();
}

function drawViewRange () {
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ROBOT_ORIGIN[0], ROBOT_ORIGIN[1]);
  ctx.lineTo(0, ROBOT_ORIGIN[1] - ROBOT_ORIGIN[0] * Math.tan(15 * deg2rad))
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ROBOT_ORIGIN[0], ROBOT_ORIGIN[1]);
  ctx.lineTo(500, ROBOT_ORIGIN[1] - ROBOT_ORIGIN[0] * Math.tan(15 * deg2rad))
  ctx.stroke();
}

function drawDistanceRings () {
  var distances = [50, 100, 150, 200, 250]; // 10, 20, 30, 40, 50
  ctx.strokeStyle = '#00f';
  ctx.lineWidth = 1;
  for (var d = 0; d < distances.length; d++) {
    ctx.beginPath();
    ctx.arc(ROBOT_ORIGIN[0], ROBOT_ORIGIN[1], distances[d], -15 * deg2rad, 195 * deg2rad, true);
    ctx.stroke();
  }
}

function drawCurrentAngle (v) {
  var RADIUS_MAX = 100,
      slope = (v[1] - ROBOT_ORIGIN[1])/(v[0] - ROBOT_ORIGIN[0]);

  var yIntercept = ROBOT_ORIGIN[1] - slope * ROBOT_ORIGIN[0];
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ROBOT_ORIGIN[0], ROBOT_ORIGIN[1]);
  if (v[0] <= ROBOT_ORIGIN[0]) {
    ctx.lineTo(0, yIntercept);
  } else {
    ctx.lineTo(CANVAS_WIDTH, CANVAS_WIDTH * slope + yIntercept);
  }
  ctx.stroke();
}

function drawPoints (mostRecentAngle) {
  ctx.clearRect(0,0,CANVAS_HEIGHT,CANVAS_WIDTH);
  console.log(ranges.length)
  for (var i = 0; i < ranges.length; i++) {
    // console.log(ranges[i]);
    drawPoint(ranges[i])
  }

  drawViewRange();
  drawDistanceRings();
  if (mostRecentAngle) {
    drawCurrentAngle(ranges[mostRecentAngle]);
  }
}

