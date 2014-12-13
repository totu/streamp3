var express = require('express');
var router = express.Router();
var fs = require('fs');
var id3 = require('id3js');
var getSize = require('get-folder-size');
var audio_location = __dirname + "/../audio/";

var get_files = function(path, sub, callback) {
  var audio = [];
  var ticker = 0;
  getSize(path, function(ress, size) {
    fs.readdir(path, function(err, files) {
      for (var i=0; i<files.length; i++) {
        var obj = {"name": files[i].split('.mp3')[0].split('.MP3')[0].replace(/_/g,' ')};

        if (sub) {
          obj.file = path.split(audio_location)[1] + files[i]
          obj.sub = true;
        } else {
          obj.file = files[i];
        }

        if (fs.lstatSync(path + files[i]).isDirectory()) {
          obj.dir = true;
        }

        audio.push(obj);

      }
      callback(audio, size);
    });
  });
}

/* GET */
router.get('/', function(req, res) {
  var audio = [];
  var path = audio_location;
  get_files(path, false, function(data, size) {
    audio = data;
    res.render('index', { title: 'Express', files: audio, size: size });
  });
});

router.get(['/:file', '/:subfolder/:file'], function(req, res) {
  var file = req.param("file");
  if (req.param("subfolder")) file = req.param("subfolder") + "/" + req.param("file");
  var filePath = audio_location + decodeURI(file);
  if (fs.existsSync(filePath)) {
    if (fs.lstatSync(filePath).isDirectory()) {
      get_files(filePath + "/", true, function(data, size) {
        res.render('index', { title: 'Express', files: data, size: size });
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

router.get(['/data/:file', '/data/:subfolder/:file'], function(req, res) {
  id3({ file: audio_location + req.param("subfolder") + "/" + req.param("file"), type: id3.OPEN_LOCAL }, function(err, tags) {
    res.json(tags);
  });
});

router.get('/test', function(req, res) {
  //res.render('test');
  res.json({"test": "asd"});
});

module.exports = router;
