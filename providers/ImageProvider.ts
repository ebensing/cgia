/// <reference path='../nodelib/node.d.ts' />

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');

declare import mongo = module("mongodb");

export class Image {
    public _id: mongo.ObjectID;
    constructor (public url: string, public title: string) { }
}

export class ImageProvider {
    public db: mongo.Db;
    constructor (public host: string, public port: number) {
        this.db = new mongo.Db('cgia', new Server(host, port, { auto_reconnect: true }, {}));
        this.db.open(function () { });
    }
    getImageCollection(callback: (error: any, collection: MongoCollection) => void ) {
        this.db.collection('images', callback);
    }
    getImageById(id: mongo.ObjectID, callback: (error: any, img: Image) => void ) {
        this.getImageCollection((error : any, images : MongoCollection) => {
            if (error) {
                callback(error, null);
            } else {
                images.findOne({ _id: id }, callback);
            }
        });
    }
}