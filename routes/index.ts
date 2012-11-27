/// <reference path='../nodelib/node.d.ts' />
/*
 * GET home page.
 */

declare import express = module("express");

var async = require('async');
import sequences = module("../providers/SequenceProvider");
import images = module("../providers/ImageProvider");
import comments = module("../providers/CommentProvider");

var sequenceHelper = new sequences.SequenceProvider("Akroma", 27017);
var imageHelper = new images.ImageProvider("Akroma", 27017);
var commentHelper = new comments.CommentProvider("Akroma", 27017);

export function index(req : express.ExpressServerRequest, res : express.ExpressServerResponse) {
    /*async.waterfall([<any> (cb : (err : any, seq : sequences.Sequence) => void) => {
        sequenceHelper.getActiveSequence(cb);
    }, (seq : sequences.Sequence, cb : (err : any, seq : sequences.Sequence, img : images.Image) => void) => {
        imageHelper.getImageById(seq.imageIds[0], (e: any, img: images.Image) => {
            cb(e, seq, img);
        });
    } ], function (error: any, seq : sequences.Sequence, img : images.Image) {
        var stage = seq.imageIds.length > 1 ? 2 : 0;
        res.render('index', { title: seq.title + " - " + img.title, imgUrl : img.url, imgId : img._id, comments : [], stage : stage, enableComments : true });
    });*/
    res.render('home', { title: "HUIT - Home" });
}

export function addComment(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    commentHelper.insertNewComment(req.body.imageId, req.body.nameTxt, parseFloat(req.body.xTxt), 
        parseFloat(req.body.yTxt), parseFloat(req.body.widthTxt), parseFloat(req.body.heightTxt), req.body.titleTxt, req.body.commentTxt, req.body.linkTxt, (error: any) => {
            res.render('postResp', {});
    });
}

export function showAllComments(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    async.waterfall([<any> (cb : (err : any, seq : sequences.Sequence) => void) => {
        sequenceHelper.getActiveSequence(cb);
    }, (seq : sequences.Sequence, cb : (err : any, seq : sequences.Sequence, img : images.Image) => void) => {
        imageHelper.getImageById(seq.imageIds[(parseInt(req.params.stage) - 1)], (e: any, img: images.Image) => {
            cb(e, seq, img);
        });
    }, (seq: sequences.Sequence, img: images.Image, cb: (err: any, seq: sequences.Sequence, img: images.Image, comments: comments.Comment[]) => void ) => {
        commentHelper.getAllCommentsByImageId(seq.imageIds[(parseInt(req.params.stage) - 1)], (error: any, cmmts: comments.Comment[]) => {
            cb(error, seq, img, cmmts);
        });
    } ], function (error: any, seq : sequences.Sequence, img : images.Image, cmmts: comments.Comment[]) {
        var cStg = parseInt(req.params.stage);
        var stage = seq.imageIds.length > cStg ? cStg + 1 : 0;
        res.render('index', { title: seq.title + " - " + img.title, imgUrl : img.url, imgId : img._id, comments : cmmts, stage: stage, prevStage: (cStg - 1), enableComments : false, urlAdd : '/all', votes: img.votes });
    });
}

export function showCuratedComments(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    async.waterfall([<any> (cb : (err : any, seq : sequences.Sequence) => void) => {
        sequenceHelper.getActiveSequence(cb);
    }, (seq : sequences.Sequence, cb : (err : any, seq : sequences.Sequence, img : images.Image) => void) => {
        imageHelper.getImageById(seq.imageIds[(parseInt(req.params.stage) - 1)], (e: any, img: images.Image) => {
            cb(e, seq, img);
        });
    }, (seq: sequences.Sequence, img: images.Image, cb: (err: any, seq: sequences.Sequence, img: images.Image, comments: comments.Comment[]) => void ) => {
        commentHelper.getAllCommentsCuratedByImageId(seq.imageIds[(parseInt(req.params.stage) - 1)], true, (error: any, cmmts: comments.Comment[]) => {
            cb(error, seq, img, cmmts);
        });
    } ], function (error: any, seq : sequences.Sequence, img : images.Image, cmmts: comments.Comment[]) {
        var cStg = parseInt(req.params.stage);
        var stage = seq.imageIds.length > cStg ? cStg + 1 : 0;
        res.render('index', { title: seq.title + " - " + img.title, imgUrl : img.url, imgId : img._id, comments : cmmts, stage: stage, prevStage: (cStg - 1), enableComments : false, urlAdd : '/curated', votes: img.votes });
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
        var stage = seq.imageIds.length >= (parseInt(req.params.stage) + 1) ? (parseInt(req.params.stage) + 1) : 0;
        res.render('index', { title: seq.title + " - " + img.title, imgUrl : img.url, imgId : img._id, comments : [], stage : stage, prevStage: (parseInt(req.params.stage) - 1), enableComments : true, urlAdd : '', votes: img.votes });
    });
}

export function done(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    res.render('done', { title: "HUIT - End" });
}

export function instructions(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    res.render('instructions', { title: "Leaking Data - Instructions" });
}

export function doVote(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    imageHelper.voteForImageById(req.params.id, (error: any) => {
        res.render('postResp', {});
    });
}