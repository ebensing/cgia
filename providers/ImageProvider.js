var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var mongo = require("mongodb")
var Image = (function () {
    function Image(url, title) {
        this.url = url;
        this.title = title;
    }
    return Image;
})();
exports.Image = Image;
var ImageProvider = (function () {
    function ImageProvider(host, port) {
        this.host = host;
        this.port = port;
        this.db = new mongo.Db('cgia', new Server(host, port, {
            auto_reconnect: true
        }, {
        }));
        this.db.open(function () {
        });
    }
    ImageProvider.prototype.getImageCollection = function (callback) {
        this.db.collection('images', callback);
    };
    ImageProvider.prototype.getImageById = function (id, callback) {
        this.getImageCollection(function (error, images) {
            if(error) {
                callback(error);
            } else {
                images.findOne({
                    _id: id
                }, callback);
            }
        });
    };
    return ImageProvider;
})();
exports.ImageProvider = ImageProvider;

