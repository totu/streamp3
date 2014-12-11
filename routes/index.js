var express = require('express');
var router = express.Router();
var fs = require('fs');
var audio_location = __dirname + "/../audio/";

var get_files = function(path, sub, callback) {
  var audio = [];
  fs.readdir(path, function(err, files) {
    for (var i=0; i<files.length; i++) {
      if (sub) {
        var obj = {"file": path.split(audio_location)[1] + files[i], "name": files[i].split('.mp3')[0], sub: true};
        obj.sub = true;
      } else {
        var obj = {"file": files[i], "name": files[i].split('.mp3')[0]};
      }
      if (fs.lstatSync(path + files[i]).isDirectory()) {
        obj.dir = true;
      }
      audio.push(obj);
    }
    data = audio
    callback(data);
  });
}

/* GET */
router.get('/', function(req, res) {
  var audio = [];
  var path = audio_location;
  get_files(path, false, function(data) {
    audio = data;
    res.render('index', { title: 'Express', files: audio });
  });
});

router.get('/:file', function(req, res) {
  var file = req.param("file");
  var filePath = audio_location + decodeURI(file);
  if (fs.existsSync(filePath)) {
    if (fs.lstatSync(filePath).isDirectory()) {
      get_files(filePath + "/", true, function(data) {
        res.render('index', { title: 'Express', files: data });
      });
    } else {
      var stat = fs.statSync(filePath);

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
      });

      var readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    }
  } else {
    res.redirect('/test');
  }
});

router.get('/test', function(req, res) {
  //res.render('test');
  res.json({"test": "asd"});
});

module.exports = router;
