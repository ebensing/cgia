/// <reference path='../nodelib/node.d.ts' />

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

declare import mongo = module("mongodb");

export class Sequence {
    public _id: mongo.ObjectID;
    constructor (public title: string, public imageIds: mongo.ObjectID[], public isActive: bool) { }
}

export class SequenceProvider {
    public db: mongo.Db;
    constructor (public host: string, public port: number) {
        this.db = new mongo.Db('cgia', new Server(host, port, { auto_reconnect: true }, { safe : true}));
        this.db.open(function () { });
    }
    getSequenceCollection(callback: (error: any, collection: MongoCollection) => void ) {
        this.db.collection('sequences', callback);
    }
    getSequenceById(id: mongo.ObjectID, callback: (error?: any, seq?: Sequence) => void ) {
        this.getSequenceCollection((error : any, sequences : MongoCollection) => {
            if (error) {
                callback(error);
            } else {
                sequences.findOne({ _id: id }, callback);
            }
        });
    }
    createNewSequence(title: string, imageIds: mongo.ObjectID[], isActive: bool, callback: (error: any) => void ) {
        this.getSequenceCollection((error: any, sequences: MongoCollection) => {
            if (error) {
                callback(error);
            } else {
                var seq = new Sequence(title, imageIds, isActive);
                sequences.insert(seq, { safe: true }, callback);
            }
        });
    }
    getActiveSequence(callback: (error: any, seq: Sequence) => void ) {
        this.getSequenceCollection((error: any, sequences: MongoCollection) => {
            if (error) {
                callback(error, null);
            } else {
                sequences.findOne({ isActive: true }, callback);
            }
        });
    }
}