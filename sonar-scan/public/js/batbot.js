var socket = io.connect('http://' + window.location.hostname);

$.domReady(function () {
  console.log('boom');

  $('.fwd').mousedown(function () {
    socket.emit('forward');
  })
  $('.back').mousedown(function () {
    socket.emit('back');
  })
  $('.left').mousedown(function () {
    socket.emit('left');
  })
  $('.right').mousedown(function () {
    socket.emit('right');
  })
  $('button').mouseup(function () {
    socket.emit('stop');
  })

})