/// <reference path='../nodelib/node.d.ts' />

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

declare import mongo = module("mongodb");

export class Comment {
    public _id: mongo.ObjectID;
    public link: string;
    public isCurated: bool;
    constructor (public imageId: mongo.ObjectID, public username: string, public x: number, 
        public y: number, public width: number, public height: number, public title: string, public text: string) { }
}

export class CommentProvider {
    public db: mongo.Db;
    constructor (public host: string, public port: number) {
        this.db = new mongo.Db('cgia-huit', new Server(host, port, { auto_reconnect: true }), { safe : true});
        this.db.open(function () { });
    }
    getCommentCollection(callback: (error: any, collection: MongoCollection) => void ) {
        this.db.collection('comment', callback);
    }
    getCommentById(id: mongo.ObjectID, callback: (error: any, cmt: Comment) => void ) {
        this.getCommentCollection((error : any, comments : MongoCollection) => {
            if (error) {
                callback(error, null);
            } else {
                comments.findOne({ _id: id }, callback);
            }
        });
    }
    insertNewComment(imageId: string, username: string, x: number, y: number, width: number, height: number, title: string, text: string, link: string, callback : (error : any) => void) {
        this.getCommentCollection((error: any, comments: MongoCollection) => {
            if (error) {
                callback(error);
            } else {
                var imgId = new ObjectID(imageId);
                var comment = new Comment(imgId, username, x, y, width, height, title, text);
                comment.link = link;
                comments.insert(comment, null, callback);
            }
        });
    }
    getAllCommentsCuratedByImageId(imageId: any, curated : bool, callback: (error: any, comments: Comment[]) => void ) {
        this.getCommentCollection((error: any, comments: MongoCollection) => {
            if (error) {
                callback(error, null);
            } else {

                var imgId = imageId;
                if (typeof imgId == "string") {
                    imgId = new ObjectID(imageId);
                }
                comments.find({ imageId: imgId, isCurated : curated }).toArray((err: any, results: Comment[]) => {
                    callback(err, results);
                });
            }
        });
    }
    getAllCommentsByImageId(imageId: any, callback: (error: any, comments: Comment[]) => void ) {
        this.getCommentCollection((error: any, comments: MongoCollection) => {
            if (error) {
                callback(error, null);
            } else {

                var imgId = imageId;
                if (typeof imgId == "string") {
                    imgId = new ObjectID(imageId);
                }
                comments.find({ imageId: imgId }).toArray((err: any, results: Comment[]) => {
                    callback(err, results);
                });
            }
        });
    }
}