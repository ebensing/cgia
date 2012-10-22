var currentMousePosition = {
    x: 0,
    y: 0
};
$("document").ready(function () {
    $("#commentSubmitBtn").click(function (e) {
        e.preventDefault();
        $("#commentForm").submit();
    });
    $("textarea").css({
        width: "505px"
    });
    $('#contact-form').validate({
        rules: {
            name: {
                minlength: 2,
                required: true
            },
            email: {
                required: true,
                email: true
            },
            subject: {
                minlength: 2,
                required: true
            },
            message: {
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
});
