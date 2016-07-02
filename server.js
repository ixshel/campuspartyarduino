// server.js
var express        = require('express');
var app            = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
var io=require('socket.io')(httpServer);
var board = new five.Board();
var port = 3000; 

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
});

httpServer.listen(port);
console.log('Server available at http://localhost:' + port);

var led;

board.on("ready", function() {
    console.log('Arduino connected');
    led = new five.Led(3);
});

io.on('connection', function (socket) {
        console.log(socket.id);

        socket.on('led:on', function (data) {
           //led.on();
           led.pulse({
    easing: "linear",
    duration: 3000,
    cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
    keyFrames: [0, 10, 0, 50, 0, 255],
    onstop: function() {
      console.log("Animation stopped");
    }
  });
           console.log('LED ON RECEIVED');
        });

        socket.on('led:off', function (data) {
            led.off();
            console.log('LED OFF RECEIVED');
            
        });
    });

