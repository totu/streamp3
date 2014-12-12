$(document).ready(function() {
  $('.file').click(function() {
    if ($(this).data('back'))
      window.location.href = "/";
    else
      window.location.href = $(this).data('file');
  });
});
