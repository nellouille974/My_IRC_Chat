var express = require('express'),
	app = express();

app.use('/', express.static(__dirname + '/'));

var server = app.listen(3000);

// Use Socket.io
var io = require('socket.io').listen(server);

io.on('connection', function (s) {
	console.log('connection : ' + s.id);

	s.emit('system_id', {id: s.id});

	s.on('message', function (payload) {
		console.log(payload.title);
		s.broadcast.emit('message', payload);
	})

});