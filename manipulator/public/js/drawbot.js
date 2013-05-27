var canvas = document.getElementById("robot"),
    ctx = canvas.getContext("2d"),
    socket = io.connect('http://localhost'),
    moveEE = false;

socket.on('init', function (joints) {
  $('#ee-val').text(" ( " + joints[2].x.toFixed(2) + " , " + joints[2].y.toFixed(2) + " )")
})

socket.on('draw', function (joints) {
  $('#ee-val').text(" ( " + joints[2].x.toFixed(2) + " , " + joints[2].y.toFixed(2) + " )")
});

socket.on('setSlide', function (angles) {
  //- console.log('angles: ', angles)
  var th1 = angles[0] * 180 / Math.PI,
      th2 = angles[1] * 180 / Math.PI;
  //- console.log(th1, th2);
  document.getElementById('slider1').value = th1;
  $('.slider1-val').text(th1.toFixed(2));
  document.getElementById('slider2').value = th2;
  $('.slider2-val').text(th2.toFixed(2));
});

$.domReady(function () {
  $('#slider1').change(function () {
    var value = $(this).val();
    socket.emit('slider1', value);
    $('.slider1-val').html(parseInt(value));
  });
  $('#slider2').change(function () {
    var value = $(this).val();
    socket.emit('slider2', value);
    $('.slider2-val').html(parseInt(value));
  });
});      

function drawLinks (joints) {
  ctx.clearRect(0,0,500,300);

  var colors = ['#c02', '#2ECCFA'];
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 20;

  for (var j = 0; j < joints.length-1; ++j) {
    ctx.strokeStyle = colors[j];
    ctx.beginPath();
    ctx.moveTo(joints[j].x, joints[j].y);
    ctx.lineTo(joints[j+1].x, joints[j+1].y);
    ctx.stroke();
  }

  // help visualize the work envelope of the robot
  ctx.strokeStyle = '#f00';
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.arc(joints[0].x, joints[0].y, 200, 0, Math.PI, false);
  ctx.stroke();

  drawEndEffector(joints[j]);
}

function drawEndEffector (endEff) {
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(endEff.x, endEff.y, 10, 0, Math.PI*2, 0);
  ctx.fill();
}

socket.on('init', function (joints) { return drawLinks(joints); });
socket.on('draw', function (joints) { return drawLinks(joints); });

getMouseClick = function (ev) {
  if (moveEE) {
    var offset = $('canvas').offset();
    var pt = {
      x : ev.clientX - offset.left,
      y : ev.clientY - offset.top
    };
    // console.log('clicked on: ',pt);
    socket.emit('click', pt);
  }
};

canvas.addEventListener('mousemove', getMouseClick, false);
canvas.addEventListener('mousedown', function () {
  moveEE = !moveEE;
});

// $('.change-angle').click(function () {
//   console.log($(this).data('angle'));
// });

