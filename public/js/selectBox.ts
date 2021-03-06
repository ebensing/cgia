declare var $;
declare var enableComments : bool;

$("document").ready(function() {
    $("#mainImage").load(function () {
        $(".image-wrap").css({
            width: $(".image-wrap > img").width() + "px"
        });
        
        var $image = $('#mainImage');
        var $container = $("<div>").addClass('image-overlay');
        var $selection = $('<div>').addClass('selection-box');
        var $modal = $("#commentInput").modal({
            backdrop: false,
            show: false
        });
        $(".arrow-wrap").css({
            "padding-top": ($(".image-wrap > img").height() / 2) + "px",
            "left" : ($image.width() + 20).toString() + "px",
            "top" : $image.position().top + "px"
        });
        $modal.on('show', () => {
            $("#nameTxt").val("");
            $("#titleTxt").val("");
            $("#commentTxt").val("");
        });
        $modal.on('hide', () => {
            $("#topCover").hide();
            $("#rightCover").hide();
            $("#leftCover").hide();
            $("#bottomCover").hide();
        });
        $container.css({
            'top': $image.position().top,
            'left': $image.position().left,
            'height': $image.height(),
            'width': $image.width()
        });
        $("body").append($container);

        $container.on('mousedown', function (e) {
            $("#commentInput").modal('hide');

            var click_y = e.pageY - $image.position().top;
            var click_x = e.pageX - $image.position().left;

            $selection.css({
                'top': click_y,
                'left': click_x,
                'width': 0,
                'height': 0,
                'z-index': 1000,
                'position' : 'absolute'
            });
            $selection.appendTo($container);
            if (enableComments) {
                $container.on('mousemove', function (e) {
                    var move_x = e.pageX - $image.position().left,
                        move_y = e.pageY - $image.position().top,
                        width = Math.abs(move_x - click_x),
                        height = Math.abs(move_y - click_y);

                    $selection.css({
                        'width': width,
                        'height': height
                    });
                    if (move_x < click_x) { //mouse moving left instead of right
                        $selection.css({
                            'left': click_x - width
                        });
                    }
                    if (move_y < click_y) { //mouse moving up instead of down
                        $selection.css({
                            'top': click_y - height
                        });
                    }
                    alignCover($selection, $image);
                }).on('mouseup', function (e) {
                    $container.off('mousemove');
                    alignCover($selection, $image);
                    $("#commentInput").modal('show');
                });
            }
        });
    });
});

function alignCover(selectObj, image) {
    var bOverflow = $(window).width() - image.width();
    bOverflow = bOverflow < 0 ? 0 : bOverflow;
    $("#yTxt").val(selectObj.position().top + image.position().top);
    $("#xTxt").val(selectObj.position().left + image.position().left);
    $("#widthTxt").val(selectObj.width());
    $("#heightTxt").val(selectObj.height());
    $("#topCover").show();
    $("#rightCover").show();
    $("#leftCover").show();
    $("#bottomCover").show();
    $("#topCover").css({
        top: 0,
        height: (selectObj.position().top + image.position().top) + "px",
        width: "100%"
    });
    $("#rightCover").css({
        top: (selectObj.position().top + image.position().top) + "px",
        left: (selectObj.position().left + image.position().left + selectObj.width()) + "px",
        height: selectObj.height() + "px",
        width: (image.width() + bOverflow - (selectObj.position().left + selectObj.width())) + "px"
    });
    $("#bottomCover").css({
        top: (selectObj.position().top + image.position().top + selectObj.height()) + "px",
        height: (image.height() - (selectObj.position().top + selectObj.height())) + "px",
        width: "100%"
    });
    $("#leftCover").css({
        top: (selectObj.position().top + image.position().top) + "px",
        height: selectObj.height() + "px",
        width: (selectObj.position().left + image.position().left) + "px",
        left: 0
    });
}
