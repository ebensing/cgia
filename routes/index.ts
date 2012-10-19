/// <reference path='../nodelib/node.d.ts' />
/*
 * GET home page.
 */

declare import express = module("express");

var async = require('async');
import sequences = module("../providers/SequenceProvider");
import images = module("../providers/ImageProvider");

var sequenceHelper = new sequences.SequenceProvider("localhost", 27017);
var imageHelper = new images.ImageProvider("localhost", 27017);

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

