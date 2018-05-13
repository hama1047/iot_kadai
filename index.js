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
var mailer = require('nodemailer');
let day_num = 0;
let month_num = 0;
const schedule = require('node-schedule');


app.get('/putdata', function (req, res) {
    let lux = req.query.lux;
    let tmp = req.query.tmp;
    let dt = new Date();
    if( lux > 0) {
	day_num += day_num;
    }
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
    io.emit("send data",data,day_num);
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


//メール設定
//var smtp      = createTransport(settings);

var settings = {
    service : 'Gmail',  //Webサービスごとの文字列                               
    //アカウント情報                                                            
    auth     : {
        user : '',
        pass : "" ,
        port : 25  //ポート番号の指定はなくてもいいっぽいです                   
    }
};

var options = {
    to          : 'al15071@shibaura-it.ac.jp',
    subject : 'Today Number of opening and closing refrigerators',
    html      : '<b>今日は<%num%>回開きました。</b>',
    form     : 'Node.js'
};
//1日のデータを格納
let j = schedule.scheduleJob({hour: 0, minute: 0}, function(){
        //Do something                                                         
        smtp.sendMail(options, function(error, result) {
                if (error) {
                    //メール送信失敗                                            
                    console.error(error);
                } else {
                    //メール送信成功                                            
                    console.dir(result);
                }

                smtp.close();
            });
        //csvに登録
	let today = dt.toFormat("YYYY-MMDD");
	const day_data = [today +',' + num +  '\n'];
	csv.stringify(day_data, function(err, output){
		fs.appendFile('day_data.csv', output, function (err) {
			if (err) {
			    throw err;
			}
		    });
	    });
	//開閉回数初期化
        month_num += day_num;
	day_num = 0;
    });
//１ヶ月のデータを格納
let l = schedule.scheduleJob({date:1}, function(){
	let month = dt.toFormat("YYYY-MM");
        const month_data = [month-1 +',' + num +  '\n'];
	csv.stringify(month_data, function(err, output){
                fs.appendFile('month_data.csv', output, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
            });
        month_num = 0;
});