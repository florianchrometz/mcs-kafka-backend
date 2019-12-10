
var server = require('express')();
var http = require('http').createServer(server);
var io = require('socket.io')(http);

server.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');

    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
});



io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });


    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });




});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

module.exports = http;