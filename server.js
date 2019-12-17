
var server = require('express')();
var http = require('http').createServer(server);
var io = require('socket.io')(http);

server.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');
    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

});

var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    Producer = kafka.Producer,
    client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});


server.get('/producer', function(req, res){


    var producer = new Producer(client);

    producer.on('ready', function () {
        producer.send([{ topic: 'chat', messages: 'init chat', partition: 0 }], function (err, data) {
            console.log("producer data: ", data);
        });
    });

    producer.on('error', function (err) {
        console.log("producer error: ", err);
    })

});

server.get('/consumer', function(req, res){


    var consumer = new Consumer(client, [{ topic: 'chat', partition: 0 }], {autoCommit: true});
    consumer.on('message', function (message) {
        console.log("consumer message: ", message);
    });

    consumer.on('error', function (err) {
        console.log("consumer error: ", err);
    })

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
