require('date-utils')
const app = require("express")();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
moment().format();
const fs = require('fs');
const filename = 'sensorData.csv';
const csv = require('csv');
const csvSync = require('csv-parse/lib/sync');


app.get('/putdata', function (req, res) {
    let lux = req.query.lux;
    let tmp = req.query.tmp;
    let dt = new Date();
    req.query.time = dt;
    let time  = dt.toFormat("YYYY-MMDD-HH24:MI.SS");
    res.send();
    const input = [time +',' + lux + ',' + tmp + '\n'];
    csv.stringify(input, function(err, output){
	console.log(time);
	console.log(lux);
	console.log(tmp);
	fs.appendFile(filename, output, function (err) {
	    if (err) {
		throw err;
	    }
	});
    });
    var data = [time,lux,tmp];
    io.emit("send data",data);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
  let dt = new Date();
  let time = dt.toFormat("YYYY-MMDD-HH24:MI.SS");
  let data = fs.readFileSync(filename);
  let res = csvSync(data);
  io.emit("first connect",res);
});

http.listen(15071, function () {
  console.log('Example app listening on port 15071!');
});
