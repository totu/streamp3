var PBInterval = null;
var base = '/stream';

var drawProgress = function() {
  var length = $('#player')[0].duration;
  var pos = $('#player')[0].currentTime;
  if (pos >= length) {
    clearInterval(PBInterval);
    PBInterval = null;
    $('#play').removeClass('glyphicon-pause playing').addClass('glyphicon-play');
    $('#progressbar').removeClass('progress-bar').addClass('progress-bar-success');
    $('#player')[0].stop();
  } else {
    if ($('#progressbar').hasClass('progress-bar-success')) $('#progressbar').removeClass('progress-bar-success').addClass('progress-bar');
    $('#progressbar').attr('aria-valuenow', pos/length*100).css('width', pos/length*100 +'%');
    var s = parseInt(pos % 60);
    if (s < 10) s = "0" + s;
    var m = parseInt((pos / 60) % 60);
    $('.current-time').html(m + ':' + s);
  }
};

var toggleProgressbar = function() {
  drawProgress();
  if ($('#play').hasClass('playing')) {
    PBInterval = setInterval(function() {
      drawProgress();
    }, 500);
  } else {
    clearInterval(PBInterval);
    PBInterval = null;
  }
};

var set_time_to = function(time) {
  var length = $('#player')[0].duration;
  $('#player')[0].currentTime = length/100*time;
  $('#seekbar, .seek-time').css('display','none');
  $('#progressbar, .current-time').css('display','block');
  drawProgress();
};

var seeking = function(time) {
  $('#progressbar, .current-time').css('display','none');
  $('#seekbar, .seek-time').css('display','block');
  var length = $('#player')[0].duration;
  var pos = length/100*time;
  $('#seekbar').attr('aria-valuenow', time).css('width', time +'%');
  var s = parseInt(pos % 60);
  if (s < 10) s = "0" + s;
  var m = parseInt((pos / 60) % 60);
  $('.seek-time').html(m + ':' + s);
};

window.addEventListener('load', function() {
  $(document).ready(function() {
    $.get(base + '/content' + window.location.pathname.replace(new RegExp(base, 'g'), ''), function(data) {
      var html = "";
      var sub = false;
      if ($.grep(window.location.pathname.replace(new RegExp(base, 'g'), '').split('/') ,function(n){return(n)}).length > 0) {
        sub = true;
        html += "<tr><td><div data-back='true' class='file'><span class='glyphicon glyphicon-share-alt backwards play-button'></span><span>Back</span>";
      }
      for (var i=0; i<data.resp.length; i++) {
        var path = window.location.pathname + data.resp[i].file
        if (sub) path = window.location.pathname + "/" + data.resp[i].file
        html += "<tr><td><div data-file='" + path + "' class='file";
        if (!data.resp[i].dir) html += " playable";
        html += "'><span class='glyphicon play-button ";
        if (data.resp[i].dir) html += "glyphicon-folder-open"
        else html += "glyphicon-play";
        if (sub) html += " sub'>";
        else html += "'>";
        html += "</span><span class='file-name'>" + data.resp[i].name + "</span> <span class='artist-name'></span></td></tr>";
      }
      $('table').html(html);

      $('.size').html(Math.floor(data.size/1024/1024) + " MB");
      $('.playable').each(function() {
        var file_name = $(this).children().eq(1);
        var artist_name = $(this).children().eq(2);
        $.get('/data' + $(this).data('file'), function(d) {
          file_name.html(d.title);
          artist_name.html(" - " + d.artist);
        });
      });

      /* Event bindings */

      $('.file').click(function() {
        if ($(this).data('back')) {
          window.location.href = '';
        } else if ($(this).hasClass('playable')) {
          $('.file').each(function() { $(this).removeClass('selected'); });
          $(this).addClass('selected');
          $('#source').attr('src', $(this).data('file'));
          $('#player')[0].pause();
          $('#player')[0].load();
          if ($('#player-frame').css('display') == 'none') $('#player-frame').css('display','block');
          $('#player')[0].play();
          $('#play').addClass('playing glyphicon-pause');
          $('#play').removeClass('glyphicon-play');
          toggleProgressbar();
        } else {
          console.log('wat')
          window.location.href = $(this).data('file');
        }
      });

      $('#play').click(function() {
        if ($(this).hasClass('playing')) {
          $('#player')[0].pause();
          $(this).removeClass('playing glyphicon-pause');
          $(this).addClass('glyphicon-play');
        } else {
          $('#player')[0].play();
          $(this).removeClass('glyphicon-play');
          $(this).addClass('playing glyphicon-pause');
        }
        toggleProgressbar();
      });

      $('#mute').click(function() {
        if ($(this).hasClass('muted')) {
          $('#player')[0].muted = false;
          $(this).removeClass('muted glyphicon-volume-off');
          $(this).addClass('glyphicon-volume-down');
        } else {
          $('#player')[0].muted = true;
          $(this).removeClass('glyphicon-volume-down');
          $(this).addClass('muted glyphicon-volume-off');
        }
      });

      $('#skip-back').click(function() {
        $('#player')[0].currentTime -= 15;
        drawProgress();
      });

      $('#skip-forward').click(function() {
        $('#player')[0].currentTime += 15;
        drawProgress();
      });

      $('#seeker').on("input", function() {
        seeking($(this).val());
      }).on("change", function(){
        set_time_to($(this).val());
      });

    });
  });
});
