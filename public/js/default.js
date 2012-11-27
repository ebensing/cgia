var currentMousePosition = {
    x: 0,
    y: 0
};
var doToggle = true;
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
            },
            linkTxt: {
                url: true,
                required: false
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
    $(".map-icon").each(function () {
        var _this = this;
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
            content: $content.html()
        });
        $(this).click(function () {
            var isShown = (/^true$/i).test($(_this).attr("shown"));
            showCovers(parseFloat($(_this).attr("y")), parseFloat($(_this).attr("x")), parseFloat($(_this).attr("w")), parseFloat($(_this).attr("h")), !isShown);
            $(_this).attr("shown", (!isShown));
            $(_this).popover('toogle');
        });
    });
    $("#instructionsModal").modal({
        backdrop: true,
        show: false,
        posModal: false
    });
    $("#instructionsBtn").click(function () {
        $("#instructionsModal").modal('show');
    });
    $("#commentGrid").modal({
        backdrop: true,
        show: false,
        posModal: false
    });
    $("#showGridBtn").click(function () {
        $("#commentGrid").modal('show');
    });
    $("#voteBtn").click(function () {
        var imgId = $("#imageId").val();
        $.post('/vote/' + imgId, {
        }, function (data) {
            $(this).hide();
            var count = parseInt($(this).siblings("span.voteBox").text());
            count++;
            $(this).siblings("span.voteBox").text(count);
        });
    });
});
function displayAllPopovers() {
    $(".map-icon").each(function () {
        $(this).popover('show');
        $(this).attr("shown", "true");
    });
}
function hideAllPopovers() {
    $(".map-icon").each(function () {
        $(this).popover('hide');
        $(this).attr("shown", "false");
    });
}
function showCovers(top, left, width, height, doShow) {
    if(doShow) {
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
