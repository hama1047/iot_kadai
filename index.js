require('date-utils')
const app = require("express")();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
moment().format();
const fs = require('fs');
const filename = 'sensorData.csv';
const csv = require('csv');

app.get('/putdata', function (req, res) {
    let lux = req.query.lux;
    let dt = new Date();
    //console.log(lux);
    req.query.time = dt;
    let formatted  = dt.toFormat("YYYY-MMDD-HH24:MI.SS");
    //console.log(formatted);
    res.send();
    const input = [formatted +',' + lux + '\n'];
    csv.stringify(input, function(err, output){
	console.log(req.query.lux);
	console.log(req.query.tmp);
	console.log(req.query.hum);
	fs.appendFile(filename, output, function (err) {
	    if (err) {
		throw err;
	    }
	});
    });
    io.emit("send data",lux);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
  let dt = new Date();
  let time = dt.toFormat("YYYY-MM-DD");
  io.emit("first connect",filename);
});

http.listen(15071, function () {
  console.log('Example app listening on port 15071!');
});
