/// <reference path='../nodelib/node.d.ts' />

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

declare import mongo = module("mongodb");

export class Image {
    public _id: mongo.ObjectID;
    constructor (public url: string, public title: string) { }
}

export class ImageProvider {
    public db: mongo.Db;
    constructor (public host: string, public port: number) {
        this.db = new mongo.Db('cgia-huit', new Server(host, port, { auto_reconnect: true }), { safe : true});
        this.db.open(function () { });
    }
    getImageCollection(callback: (error: any, collection: MongoCollection) => void ) {
        this.db.collection('images', callback);
    }
    getImageById(id: any, callback: (error: any, img: Image) => void ) {
        this.getImageCollection((error : any, images : MongoCollection) => {
            if (error) {
                callback(error, null);
            } else {
                var oId = id;
                if(typeof oId == "string")
                {
                    oId = new mongo.ObjectID(id);
                }
                images.findOne({ _id: oId }, callback);
            }
        });
    }
}