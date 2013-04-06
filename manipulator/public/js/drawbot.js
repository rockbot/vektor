(function () {
  var canvas = document.getElementById("robot");
  var ctx = canvas.getContext("2d");
  var socket = io.connect('http://localhost');

  function drawLinks (joints) {
    ctx.clearRect(0,0,400,400);

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
  }

  // function drawPoint(joints) {
  //   ctx.clearRect(0,0,400,400);

  //   for (var j=0; j < joints.length; ++j) {
  //     var pt = joints[j];
  //     console.log(pt)
  //     ctx.fillStyle = "#000";
  //     ctx.beginPath();
  //     ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2, 0);
  //     ctx.fill();

  //   }
  // }

  socket.on('init', function (joints) { return drawLinks(joints); });
  socket.on('draw', function (joints) { return drawLinks(joints); });

  getMouseClick = function (ev) {
    var offset = $('canvas').offset();
    var pt = {
      x : ev.clientX - offset.left,
      y : ev.clientY - offset.top
    };
    socket.emit('click', pt);
    // drawPoint(pt);
  };

  canvas.addEventListener('mousedown', getMouseClick, false);

  $('.change-angle').click(function () {
    console.log($(this).data('angle'));
  });

}());
