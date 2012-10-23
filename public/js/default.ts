declare var $;
var currentMousePosition = { x: 0, y: 0 };
$("document").ready(() => {
    var $form = $("#commentForm");
    $form.submit(() => {
        $.post($form.attr('action'), $form.serialize(), function (response) {
            $("#commentInput").modal('hide');
            $("#topCover").hide();
            $("#rightCover").hide();
            $("#leftCover").hide();
            $("#bottomCover").hide();
            $(".image-overlay").hide();
        }, 'json');
        return false;
    });
    $("#commentSubmitBtn").click((e: Event) => {
        e.preventDefault();
        $("#commentForm").submit();
    });
    $("textarea").css({
        width: "365px"
    });
    $('#commentForm').validate({
        rules: {
            titleTxt: {
                minlength: 2,
                required: true
            },
            nameTxt: {
                minlength: 2,
                required: true
            },
            commentTxt: {
                minlength: 2,
                required: true
            }
        },
        highlight: function (label) {
            $(label).closest('.control-group').addClass('error');
        },
        success: function (label) {
            label
            .text('OK!').addClass('valid')
            .closest('.control-group').addClass('success');
        }
    });
    $(document).mousemove(function (event) {
        currentMousePosition = {
            x: event.pageX,
            y: event.pageY
        };
    });
});