var express = require('express');
var router = express.Router();
var fs = require('fs');
var id3 = require('id3js');
var getSize = require('get-folder-size');
var audio_location = __dirname + "/../audio/";

/* GET */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/content/*', function(req, res) {
  var path = audio_location + req.params[0] + "/";
  var audio = [];
  var sub = false;
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
      res.json({"resp":audio, "size":size});
    });
  });
});


router.get('/data/*', function(req, res) {
  id3({ file: audio_location + req.params[0], type: id3.OPEN_LOCAL }, function(err, tags) {
    res.json(tags);
  });
});

router.get('/*', function(req, res) {
  var filePath = audio_location + decodeURI(req.params[0]);
  if (fs.existsSync(filePath)) {
    if (fs.lstatSync(filePath).isDirectory()) {
      res.render('index', { title: 'Express', files: {}, size: 0 });
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
    res.redirect('/');
  }
});

router.get('/test', function(req, res) {
  //res.render('test');
  res.json({"test": "asd"});
});

module.exports = router;
