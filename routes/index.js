var express = require('express');
var router = express.Router();
var fs = require('fs');
var audio_location = __dirname + "/../audio/";

/* GET */
router.get('/', function(req, res) {
  var audio = [];
  var tmp = null;
  fs.readdir(audio_location , function(err, files) {
    for (var i=0; i<files.length; i++) {
      audio.push({"file": files[i], "name": files[i].split('.mp3')[0]});
    }
    res.render('index', { title: 'Express', results: tmp, files: audio });
  });
});

router.get('/play/:file', function(req, res) {
  var file = req.param("file");
  var filePath = audio_location + decodeURI(file);
  if (fs.existsSync(filePath)) {
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else {
    res.redirect('/test');
  }
});


router.get('/test', function(req, res) {
  //res.render('test');
  res.json({"test": "asd"});
});


/* POST */
router.post('/upload', function(req, res) {
  var file = req.query.file;
  fs.readFile(file.path, function(err, data) {
    var path = audio_location + file.name;
    fs.writeFile(path, data, function(err) {
      if (err) {
        res.json({"upload": false, "error": err});
      } else {
        res.json({"upload": true});
      }
    });
  });
});

module.exports = router;
