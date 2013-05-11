var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var mongo = require("mongodb")
var Image = (function () {
    function Image(url, title) {
        this.url = url;
        this.title = title;
        this.votes = 0;
    }
    return Image;
})();
exports.Image = Image;
var ImageProvider = (function () {
    function ImageProvider(host, port) {
        this.host = host;
        this.port = port;
        this.db = new mongo.Db('cgia-huit', new Server(host, port, {
            auto_reconnect: true
        }), {
            safe: true
        });
        this.db.open(function () {
        });
    }
    ImageProvider.prototype.getImageCollection = function (callback) {
        this.db.collection('images', callback);
    };
    ImageProvider.prototype.getImageById = function (id, callback) {
        this.getImageCollection(function (error, images) {
            if(error) {
                callback(error, null);
            } else {
                var oId = id;
                if(typeof oId == "string") {
                    oId = new mongo.ObjectID(id);
                }
                images.findOne({
                    _id: oId
                }, callback);
            }
        });
    };
    ImageProvider.prototype.voteForImageById = function (id, callback) {
        this.getImageCollection(function (error, images) {
            if(error) {
                callback(error);
            } else {
                var oId = new mongo.ObjectID(id);
                images.update({
                    _id: oId
                }, {
                    $inc: {
                        votes: 1
                    }
                }, callback);
            }
        });
    };
    return ImageProvider;
})();
exports.ImageProvider = ImageProvider;
