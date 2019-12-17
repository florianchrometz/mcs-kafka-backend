
var server = require('express')();
var http = require('http').createServer(server);
var io = require('socket.io')(http);

server.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');

    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
});

server.get('/producer', function(req, res){

    var kafka = require('kafka-node'),
        Producer = kafka.Producer,
        KeyedMessage = kafka.KeyedMessage,
        client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'}),
        producer = new Producer(client),
        km = new KeyedMessage('key', 'message'),
        payloads = [
            { topic: 'topic1', messages: 'hi', partition: 0 },
            { topic: 'topic2', messages: ['hello', 'world', km] }
        ];
    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
    });

    producer.on('error', function (err) {})

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

http.listen(8080, function(){
    console.log('listening on *:8080');
});

module.exports = http;