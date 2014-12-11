var http = require('http'),
fs = require('fs'),
path = require('path'),
url = require('url'),
mm = require('musicmetadata'),
getSize = require('get-folder-size'),
port = 2000;

http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname,
  filename = url.parse(req.url).query;
  if (pathname == '/listen' && filename != null) {
    var filePath = __dirname + '/audio/' + decodeURI(filename);
    var stat = fs.statSync(filePath);
    console.log(req.connection.remoteAddress + " is listening to " + decodeURI(filename));

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

  } else {
    fs.readdir(__dirname + '/audio', function(err, files) {
      var _files = [];
      var _titles = [];
      var _size = 0;
      var ticker = 0
      getSize(__dirname + '/audio', function(err, size) {
	_size = size;
        for (var i = 0; i<files.length; i++) {
          var parser = mm(fs.createReadStream(__dirname + '/audio/' + files[i]));
          var file = require('querystring').escape(files[i]);
	  _files.push(file);
          parser.on('metadata', function(data) {
            var title = data.title ? data.title : files[i].split('.')[0];
	    _titles.push(title);
            ticker++;
          });
        }
      });


      var interval = setInterval(function() {
        if (ticker == files.length) {
      	  var html = '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>StreaMP3</title><link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"><link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css"><script src="//code.jquery.com/jquery-2.1.1.min.js"></script><script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script></head>';
          html += '<body><nav class="navbar navbar-inverse" role="navigaton" style="margin:0"><div class="container"><div class="navbar-header"><span class="navbar-brand">StreaMP3</span><span class="navbar-text" style="float:right">' + (_size/1024/1024).toFixed(2) + ' Mb&nbsp; </span></div></div></nav><table style="border-bottom:1px solid #ddd" class="starter-template table table-striped">';
          for (var i=0; i<_files.length; i++) {
            html += "<tr><td><a class='lead' href='listen?" + _files[i] + "'><div style='height:100%;width:100%'><span class='glyphicon glyphicon-play'></span> " + _titles[i] + "</div></a></td></tr>";
	  }

	  html += "</table></body></html>";
          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': html.length
          });
          res.write(html);
          //console.log("render");
          res.end();
          clearInterval(interval);
        }
      });
    });


  }
}).listen(port);

console.log("StreaMP3 running on port " + port + "...")
