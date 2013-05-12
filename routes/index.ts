/// <reference path='../nodelib/node.d.ts' />
/*
 * GET home page.
 */

declare import express = module("express");

var async = require('async');
import sequences = module("../providers/SequenceProvider");
import images = module("../providers/ImageProvider");
import comments = module("../providers/CommentProvider");
import fs = module("fs");

var sequenceHelper = new sequences.SequenceProvider("Localhost", 27017);
var imageHelper = new images.ImageProvider("Localhost", 27017);
var commentHelper = new comments.CommentProvider("Localhost", 27017);

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
    res.render('instructions', { title: "HUIT Careers - Instructions" });
}

export function doVote(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    imageHelper.voteForImageById(req.params.id, (error: any) => {
        res.render('postResp', {});
    });
}

export function map(req: express.ExpressServerRequest, res: express.ExpressServerResponse) {
    var jsonMap = JSON.parse(fs.readFileSync("routes/img_map.json", "utf8").toString());
    var map_data = [
        [
            { title: 'Cross Functional Management', itemStrs: ['IT Management'], items :[] },
            { title: 'Project Management', itemStrs: ['Program Management', 'Project Management', 'Project Coordination'], items: [] },
            { title: 'Business Analysis and Design', itemStrs: ['Product Management', 'Business Systems Design', 'Business Systems Analysis'], items: [] },
            { title: 'Applications Development & Integration', itemStrs: ['Applications Mgmt', 'Data Architecture', 'Applications Architecture', 'Application Development'], items: [] }
        ],                      
        [                       
            { title: 'Quality Assurance', itemStrs: ['Quality Assurance Management', 'Quality Assurance'], items: [] },
            { title: 'Release and Configuration Management', itemStrs: ['Release Management', 'Release Analysis', 'Service Management', 'Configuration Management'], items: [] },
            { title: 'Database Administration', itemStrs: ['Database Management', 'Database Architecture', 'Database Administration'], items: [] },
            { title: 'User Support and Customer and Client Services', itemStrs: ['User Support Management', 'Tech / Field Support', 'Help Desk / User Support', 'Product Specialist'], items: [] }
        ],                      
        [                       
            { title: 'Server and Systems Engineering and Administration', itemStrs: ['Systems Management', 'Systems Architecture', 'Systems Engineering', 'Web Administration', 'Systems Administration'], items: [] },
            { title: 'Operations Management', itemStrs: ['Data Center Management', 'Shift Management'], items: [] },
            { title: 'Hosting Data Storage', itemStrs: ['Data Storage Management', 'Data Storage Engineering', 'Data Storage Administration'], items: [] },
            { title: 'Network Engineering', itemStrs: ['Network Management', 'Network Architecture', 'Network Engineering', 'Network Administration', 'Telecomm Mgmt', 'Telecomm Administration'], items: [] }
        ],                      
        [                       
            { title: 'IT Security', itemStrs: ['IT Security Management', 'IT Security Architecture', 'IT Security Engineering', 'IT Security Response, Research & Analysis'], items: [] },
            { title: 'User Experience', itemStrs: ['User Experience', 'Usability Testing & Design', 'Experience Research & Modeling'], items: [] },
            { title: 'Media Services', itemStrs: ['Digital Media Management', 'Video Engineering', 'Media Technology', 'Video Production', 'Classroom Support', 'Digital Imaging'], items: [] },
            { title: 'Educational Technology', itemStrs: ['Instructional Design', 'Classroom Design', 'Multimedia Engineering', 'Multimedia Design', 'Multimedia Production', 'Applications Development', 'Education Technology Consulting'], items: [] }
        ],
    ];
    for (var i = 0; i < map_data.length; i++) {
        for (var x = 0; x < map_data[i].length; x++) {
            for (var z = 0; z < map_data[i][x].itemStrs.length; z++) {
                if (map_data[i][x].itemStrs[z] in jsonMap) {
                    map_data[i][x].items.push({ title: map_data[i][x].itemStrs[z], disabled: false, url: '/stage/' + jsonMap[map_data[i][x].itemStrs[z]].toString() });
                } else {
                    map_data[i][x].items.push({ title: map_data[i][x].itemStrs[z], disabled: true });
                }
            }
        }
    }
    res.render('map', { title: "HUIT Careers - Instructions", rows: map_data });
}