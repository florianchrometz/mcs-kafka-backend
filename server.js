
var server = require('express')();
var http = require('http').createServer(server);
var io = require('socket.io')(http);



var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'}),
    producer = new Producer(client)
    consumer = new Consumer(client, [{ topic: 'topicname', partition: 0 }], {autoCommit: false}
);



server.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');

    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
});

server.get('/producer', function(req, res){


    producer.on('ready', function () {
        producer.send([{ topic: 'topicname', messages: ['hello', 'world'] }], function (err, data) {
            console.log(data);
        });
    });

    producer.on('error', function (err) {
        console.log(err)
    })

});

consumer.on('message', function (message) {
    console.log(message);
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