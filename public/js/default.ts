declare var $;
var currentMousePosition = { x: 0, y: 0 };
var doToggle = true;
$("document").ready(() => {
    var $form = $("#commentForm");
    $form.submit(() => {
        if ($("#commentForm").valid()) {
            $.post($form.attr('action'), $form.serialize(), function (response) {

            }, 'json');
            $("#commentInput").modal('hide');
        }
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
            },
            linkTxt: {
                url : true,
                required: false
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
    $(".icon-screenshot").each(function () {
        $(this).css({
            top: $(this).attr("y") + "px",
            left: $(this).attr("x") + "px"
        });
        $(this).attr("shown", "false");
        var $content = $("#content-" + $(this).attr("id"));
        $(this).popover({
            animation: true,
            html: true,
            title: $content.attr("title") + " By: " + $content.attr("user"),
            content: $content.text()
        });
        $(this).click(() => {
            var isShown = (/^true$/i).test($(this).attr("shown"));
            showCovers(parseFloat($(this).attr("y")), parseFloat($(this).attr("x")), parseFloat($(this).attr("w")), parseFloat($(this).attr("h")), !isShown);
            $(this).attr("shown", (!isShown));
            $(this).popover('toogle');
        });
    });

    $("#instructionsModal").modal({
        backdrop: true,
        show: false,
        posModal : false
    });
    $("#instructionsBtn").click(function () {
        $("#instructionsModal").modal('show');
    });
});

function displayAllPopovers() {
    $(".icon-screenshot").each(function () {
        $(this).popover('show');
        $(this).attr("shown", "true");
    });
}

function hideAllPopovers() {
    $(".icon-screenshot").each(function () {
        $(this).popover('hide');
        $(this).attr("shown", "false");
    });
}

function showCovers(top, left, width, height, doShow : bool) {
    if (doShow) {
        $("#topCover").show();
        $("#rightCover").show();
        $("#leftCover").show();
        $("#bottomCover").show();
    } else {
        $("#topCover").hide();
        $("#rightCover").hide();
        $("#leftCover").hide();
        $("#bottomCover").hide();
    }
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