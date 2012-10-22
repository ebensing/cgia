var currentMousePosition = {
    x: 0,
    y: 0
};
$("document").ready(function () {
    $("#commentSubmitBtn").click(function (e) {
        e.preventDefault();
        $("#commentForm").submit();
    });
    $(document).mousemove(function (event) {
        currentMousePosition = {
            x: event.pageX,
            y: event.pageY
        };
    });
    $("#mainImage").load(function () {
        var $image = $('#mainImage');
        var $container = $("<div>").addClass('image-overlay');
        var $selection = $('<div>').addClass('selection-box');
        var $modal = $("#commentInput").modal({
            backdrop: false,
            show: false
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
                'position': 'absolute'
            });
            $selection.appendTo($container);
            $container.on('mousemove', function (e) {
                var move_x = e.pageX - $image.position().left;
                var move_y = e.pageY - $image.position().top;
                var width = Math.abs(move_x - click_x);
                var height = Math.abs(move_y - click_y);

                $selection.css({
                    'width': width,
                    'height': height
                });
                if(move_x < click_x) {
                    $selection.css({
                        'left': click_x - width
                    });
                }
                if(move_y < click_y) {
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
        });
    });
});
function alignCover(selectObj, image) {
    var bOverflow = $(window).width() - image.width();
    bOverflow = bOverflow < 0 ? 0 : bOverflow;
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
