var currentMousePosition = {
    x: 0,
    y: 0
};
$("document").ready(function () {
    var $form = $("#commentForm");
    $form.submit(function () {
        if($("#commentForm").valid()) {
            $.post($form.attr('action'), $form.serialize(), function (response) {
            }, 'json');
            $("#commentInput").modal('hide');
        }
        return false;
    });
    $("#commentSubmitBtn").click(function (e) {
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
            label.text('OK!').addClass('valid').closest('.control-group').addClass('success');
        }
    });
    $(document).mousemove(function (event) {
        currentMousePosition = {
            x: event.pageX,
            y: event.pageY
        };
    });
    $(".icon-screenshot").each(function () {
        var _this = this;
        $(this).css({
            top: $(this).attr("y") + "px",
            left: $(this).attr("x") + "px"
        });
        var $content = $("#content-" + $(this).attr("id"));
        $(this).popover({
            animation: true,
            html: false,
            title: $content.attr("title") + " By: " + $content.attr("user"),
            content: $content.text()
        });
        $(this).click(function () {
            showCovers(parseFloat($(_this).attr("y")), parseFloat($(_this).attr("x")), parseFloat($(_this).attr("w")), parseFloat($(_this).attr("h")));
            $(_this).popover('toogle');
        });
    });
});
function displayAllPopovers() {
    $(".icon-screenshot").each(function () {
        $(this).popover('show');
    });
}
function hideAllPopovers() {
    $(".icon-screenshot").each(function () {
        $(this).popover('hide');
    });
}
function showCovers(top, left, width, height) {
    $("#topCover").toggle();
    $("#rightCover").toggle();
    $("#leftCover").toggle();
    $("#bottomCover").toggle();
    var image = $(".image-wrap > img");
    var selectTop = top - image.position().top;
    $("#topCover").css({
        top: 0,
        height: top + "px",
        width: "100%"
    });
    $("#rightCover").css({
        top: top + "px",
        left: (left + width) + "px",
        height: height + "px",
        width: (image.width() + (left + width)) + "px"
    });
    $("#bottomCover").css({
        top: (top + height) + "px",
        height: (image.height() + 10 - (height + selectTop)) + "px",
        width: "100%"
    });
    $("#leftCover").css({
        top: (top) + "px",
        height: height + "px",
        width: (left) + "px",
        left: 0
    });
}
