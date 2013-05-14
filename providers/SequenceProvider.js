var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var mongo = require("mongodb")
var Sequence = (function () {
    function Sequence(title, imageIds, isActive) {
        this.title = title;
        this.imageIds = imageIds;
        this.isActive = isActive;
    }
    return Sequence;
})();
exports.Sequence = Sequence;
var SequenceProvider = (function () {
    function SequenceProvider(host, port) {
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
    SequenceProvider.prototype.getSequenceCollection = function (callback) {
        this.db.collection('sequences', callback);
    };
    SequenceProvider.prototype.getSequenceById = function (id, callback) {
        this.getSequenceCollection(function (error, sequences) {
            if(error) {
                callback(error);
            } else {
                sequences.findOne({
                    _id: id
                }, callback);
            }
        });
    };
    SequenceProvider.prototype.createNewSequence = function (title, imageIds, isActive, callback) {
        this.getSequenceCollection(function (error, sequences) {
            if(error) {
                callback(error);
            } else {
                var seq = new Sequence(title, imageIds, isActive);
                sequences.insert(seq, {
                    safe: true
                }, callback);
            }
        });
    };
    SequenceProvider.prototype.getActiveSequence = function (callback) {
        this.getSequenceCollection(function (error, sequences) {
            if(error) {
                callback(error, null);
            } else {
                sequences.findOne({
                    isActive: true
                }, callback);
            }
        });
    };
    return SequenceProvider;
})();
exports.SequenceProvider = SequenceProvider;
