var express = require('express');
var router = express.Router();
var audio_location = __dirname + "/../audio/";

/* GET home page. */
router.get('/', function(req, res) {
  var fs = require('fs');
  var audio = [];
  var tmp = null;
  fs.readdir(audio_location , function(err, files) {
    for (var i=0; i<files.length; i++) {
      audio.push({"file": files[i], "name": files[i].split('.mp3')[0]});
    }
    res.render('index', { title: 'Express', results: tmp, files: audio });
  });
});

router.get('/test', function(req, res) {
  res.render('test');
});
module.exports = router;
