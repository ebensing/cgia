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
            res.render('index', { title: seq.title, imgUrl : img.url });
    });
}

export function addComment(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    commentHelper.insertNewComment(req.params.imageId, req.params.username, parseFloat(req.params.x), 
        parseFloat(req.params.y), parseFloat(req.params.width), parseFloat(req.params.height), req.params.title, req.params.text, (error: any) => {
            res.render('postResp', {});
    });
}

