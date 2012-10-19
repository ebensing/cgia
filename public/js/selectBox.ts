declare var $;

$("document").ready(function() {
    var $image = $('#mainImage');
    var $container = $("div").addClass('image-overlay');
    var $selection = $('<div>').addClass('selection-box');

    $container.css({
        'top': $image.top(),
        'left': $image.left(),
        'height': $image.height(),
        'width' : $image.width()
    });

    $container.on('mousedown', function(e) {
        var click_y = e.pageY;
        var click_x = e.pageX;

        $selection.css({
          'top':    click_y,
          'left':   click_x,
          'width':  0,
          'height': 0,
          'background-color' : 'red',
          'z-index' : 1000
        });
        $selection.appendTo($container);

        $container.on('mousemove', function(e) {
            var move_x = e.pageX,
                move_y = e.pageY,
                width  = Math.abs(move_x - click_x),
                height = Math.abs(move_y - click_y);

            $selection.css({
                'width':  width,
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
        });
    });
});
