$("document").ready(function () {
    $("#mainImage").load(function () {
        var $image = $('#mainImage');
        var $container = $("<div>").addClass('image-overlay');
        var $selection = $('<div>').addClass('selection-box');
        $container.css({
            'top': $image.position().top,
            'left': $image.position().left,
            'height': $image.height(),
            'width': $image.width()
        });
        $("body").append($container);
        $container.on('mousedown', function (e) {
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
            }).on('mouseup', function (e) {
                $container.off('mousemove');
                alignCover($selection, $image);
            });
        });
    });
});
function alignCover(selectObj, image) {
    $("#topCover").css({
        top: 0,
        height: (selectObj.position().top + image.position().top) + "px",
        width: $("body").width() + "px"
    });
}
