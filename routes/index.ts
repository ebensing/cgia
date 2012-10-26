/// <reference path='../nodelib/node.d.ts' />
/*
 * GET home page.
 */

declare import express = module("express");

var async = require('async');
import sequences = module("../providers/SequenceProvider");
import images = module("../providers/ImageProvider");
import comments = module("../providers/CommentProvider");

var sequenceHelper = new sequences.SequenceProvider("localhost", 27017);
var imageHelper = new images.ImageProvider("localhost", 27017);
var commentHelper = new comments.CommentProvider("localhost", 27017);

export function index(req : express.ExpressServerRequest, res : express.ExpressServerResponse) {
    async.waterfall([<any> (cb : (err : any, seq : sequences.Sequence) => void) => {
        sequenceHelper.getActiveSequence(cb);
    }, (seq : sequences.Sequence, cb : (err : any, seq : sequences.Sequence, img : images.Image) => void) => {
        imageHelper.getImageById(seq.imageIds[0], (e: any, img: images.Image) => {
            cb(e, seq, img);
        });
    } ], function (error: any, seq : sequences.Sequence, img : images.Image) {
        var stage = seq.imageIds.length > 1 ? 2 : 0;
        res.render('index', { title: seq.title, imgUrl : img.url, imgId : img._id, comments : [], stage : stage });
    });
}

export function addComment(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    commentHelper.insertNewComment(req.body.imageId, req.body.nameTxt, parseFloat(req.body.xTxt), 
        parseFloat(req.body.yTxt), parseFloat(req.body.widthTxt), parseFloat(req.body.heightTxt), req.body.titleTxt, req.body.commentTxt, (error: any) => {
            res.render('postResp', {});
    });
}

export function showAllComments(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    async.waterfall([<any> (cb : (err : any, seq : sequences.Sequence) => void) => {
        sequenceHelper.getActiveSequence(cb);
    }, (seq : sequences.Sequence, cb : (err : any, seq : sequences.Sequence, img : images.Image) => void) => {
        imageHelper.getImageById(seq.imageIds[0], (e: any, img: images.Image) => {
            cb(e, seq, img);
        });
    }, (seq: sequences.Sequence, img: images.Image, cb: (err: any, seq: sequences.Sequence, img: images.Image, comments: comments.Comment[]) => void ) => {
        commentHelper.getAllCommentsByImageId(req.params.imageId, (error: any, cmmts: comments.Comment[]) => {
            cb(error, seq, img, cmmts);
        });
    } ], function (error: any, seq : sequences.Sequence, img : images.Image, cmmts: comments.Comment[]) {
            res.render('index', { title: seq.title, imgUrl : img.url, imgId : img._id, comments : cmmts });
    });
}

export function getSpecificStage(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    async.waterfall([<any> (cb : (err : any, seq : sequences.Sequence) => void) => {
        sequenceHelper.getActiveSequence(cb);
    }, (seq : sequences.Sequence, cb : (err : any, seq : sequences.Sequence, img : images.Image) => void) => {
        imageHelper.getImageById(seq.imageIds[(parseInt(req.params.stage) - 1)], (e: any, img: images.Image) => {
            cb(e, seq, img);
        });
    } ], function (error: any, seq : sequences.Sequence, img : images.Image) {
        var stage = seq.imageIds.length > (parseInt(req.params.stage) + 1) ? (parseInt(req.params.stage) + 1) : 0;
        res.render('index', { title: seq.title, imgUrl : img.url, imgId : img._id, comments : [], stage : stage });
    });
}
