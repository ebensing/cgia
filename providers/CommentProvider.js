var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var mongo = require("mongodb")
var Comment = (function () {
    function Comment(imageId, username, x, y, width, height, title, text) {
        this.imageId = imageId;
        this.username = username;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.title = title;
        this.text = text;
    }
    return Comment;
})();
exports.Comment = Comment;
var CommentProvider = (function () {
    function CommentProvider(host, port) {
        this.host = host;
        this.port = port;
        this.db = new mongo.Db('cgia', new Server(host, port, {
            auto_reconnect: true
        }), {
            safe: true
        });
        this.db.open(function () {
        });
    }
    CommentProvider.prototype.getCommentCollection = function (callback) {
        this.db.collection('comment', callback);
    };
    CommentProvider.prototype.getImageById = function (id, callback) {
        this.getCommentCollection(function (error, comments) {
            if(error) {
                callback(error, null);
            } else {
                comments.findOne({
                    _id: id
                }, callback);
            }
        });
    };
    CommentProvider.prototype.insertNewComment = function (imageId, username, x, y, width, height, title, text, callback) {
        this.getCommentCollection(function (error, comments) {
            if(error) {
                callback(error);
            } else {
                var imgId = new ObjectID(imageId);
                var comment = new Comment(imgId, username, x, y, width, height, title, text);
                comments.insert(comment, null, callback);
            }
        });
    };
    return CommentProvider;
})();
exports.CommentProvider = CommentProvider;
