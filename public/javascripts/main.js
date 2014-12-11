$(document).ready(function() {
  $('.file').click(function() {
    if ($(this).data('back'))
      window.location.href = "/";
    else
      window.location.href = $(this).data('file');
  });

  $('#upload').click(function() {
    bootbox.dialog({
      title: "Upload a new audio file",
      message: "<form id='file_upload_form' method='post' enctype='multipart/form-data'><input type='file' id='file' name='file'></form>",
      buttons: {
        cancel: {
          label: "Cancel",
          className: "btn-default",
          callback: function() {
            $('#file_upload_form').trigger('reset');
          }
        },
        upload: {
          label: "Upload!",
          className: "btn-primary",
          callback: function() {
            $.post('upload', $('#file_upload_form').serialize(), function(data) {
              console.log(data);
            });
          }
        }
      }
    });
  });
});
