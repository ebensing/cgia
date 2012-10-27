var express = require("express")
var routes = require('./routes');
var http = require('http');

var app = express.createServer();
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.set('view options', {
        pretty: true
    });
});
app.configure('development', function () {
    app.use(express.errorHandler());
});
app.get('/', routes.index);
app.get('/showAll/:imageId', routes.showAllComments);
app.post('/addComment', routes.addComment);
app.get('/stage/:stage', routes.getSpecificStage);
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

