$(document).ready(function() {
  $('.playable').each(function() {
    var file_name = $(this).children().eq(1);
    $.get('/data/' + $(this).data('file'), function(data) {
      file_name.html(data.title);
    });
  });

  $('.file').click(function() {
    if ($(this).data('back'))
      window.location.href = "/";
    else
      window.location.href = $(this).data('file');
  });
});
