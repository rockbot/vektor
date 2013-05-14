(function () {
  var canvas = document.getElementById("robot");
  var ctx = canvas.getContext("2d");
  var socket = io.connect('http://localhost');
  var moveEE = false;

  function drawLinks (joints) {
    ctx.clearRect(0,0,500,300);

    var colors = ['#c02', '#afb', '#15f'];
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
      console.log('clicked on: ',pt);
      socket.emit('click', pt);
    }
  };

  canvas.addEventListener('mousemove', getMouseClick, false);
  canvas.addEventListener('mousedown', function () {
    moveEE = !moveEE;
  });
  // canvas.addEventListener('mouseup', function () {
  //   moveEE = false;
  // });

  $('.change-angle').click(function () {
    console.log($(this).data('angle'));
  });

}());
