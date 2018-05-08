var express = require('express');
var app = express();

app.get('/', function (req, res) {
  console.log(req.query.lux);
  res.send();
});

app.listen(15071, function () {
  console.log('Example app listening on port 15071!');
});
