
var async = require('async');
var sequences = require("../providers/SequenceProvider")
var images = require("../providers/ImageProvider")
var comments = require("../providers/CommentProvider")
var sequenceHelper = new sequences.SequenceProvider("localhost", 27017);
var imageHelper = new images.ImageProvider("localhost", 27017);
var commentHelper = new comments.CommentProvider("localhost", 27017);
function index(req, res) {
    res.render('home', {
        title: "Leaking Data - Home"
    });
}
exports.index = index;
function addComment(req, res) {
    commentHelper.insertNewComment(req.body.imageId, req.body.nameTxt, parseFloat(req.body.xTxt), parseFloat(req.body.yTxt), parseFloat(req.body.widthTxt), parseFloat(req.body.heightTxt), req.body.titleTxt, req.body.commentTxt, req.body.linkTxt, function (error) {
        res.render('postResp', {
        });
    });
}
exports.addComment = addComment;
function showAllComments(req, res) {
    async.waterfall([
        function (cb) {
            sequenceHelper.getActiveSequence(cb);
        }, 
        function (seq, cb) {
            imageHelper.getImageById(seq.imageIds[(parseInt(req.params.stage) - 1)], function (e, img) {
                cb(e, seq, img);
            });
        }, 
        function (seq, img, cb) {
            commentHelper.getAllCommentsByImageId(seq.imageIds[(parseInt(req.params.stage) - 1)], function (error, cmmts) {
                cb(error, seq, img, cmmts);
            });
        }    ], function (error, seq, img, cmmts) {
        var cStg = seq.imageIds.indexOf(img._id);
        var stage = seq.imageIds.length > (cStg + 1) ? (cStg + 1) : 0;
        res.render('index', {
            title: seq.title,
            imgUrl: img.url,
            imgId: img._id,
            comments: cmmts,
            stage: stage,
            enableComments: false,
            urlAdd: '/all'
        });
    });
}
exports.showAllComments = showAllComments;
function showCuratedComments(req, res) {
    async.waterfall([
        function (cb) {
            sequenceHelper.getActiveSequence(cb);
        }, 
        function (seq, cb) {
            imageHelper.getImageById(seq.imageIds[(parseInt(req.params.stage) - 1)], function (e, img) {
                cb(e, seq, img);
            });
        }, 
        function (seq, img, cb) {
            commentHelper.getAllCommentsCuratedByImageId(seq.imageIds[(parseInt(req.params.stage) - 1)], true, function (error, cmmts) {
                cb(error, seq, img, cmmts);
            });
        }    ], function (error, seq, img, cmmts) {
        var cStg = seq.imageIds.indexOf(img._id);
        var stage = seq.imageIds.length > (cStg + 1) ? (cStg + 1) : 0;
        res.render('index', {
            title: seq.title,
            imgUrl: img.url,
            imgId: img._id,
            comments: cmmts,
            stage: stage,
            enableComments: false,
            urlAdd: '/curated'
        });
    });
}
exports.showCuratedComments = showCuratedComments;
function getSpecificStage(req, res) {
    async.waterfall([
        function (cb) {
            sequenceHelper.getActiveSequence(cb);
        }, 
        function (seq, cb) {
            imageHelper.getImageById(seq.imageIds[(parseInt(req.params.stage) - 1)], function (e, img) {
                cb(e, seq, img);
            });
        }    ], function (error, seq, img) {
        var stage = seq.imageIds.length >= (parseInt(req.params.stage) + 1) ? (parseInt(req.params.stage) + 1) : 0;
        res.render('index', {
            title: seq.title + " - " + img.title,
            imgUrl: img.url,
            imgId: img._id,
            comments: [],
            stage: stage,
            enableComments: true,
            urlAdd: ''
        });
    });
}
exports.getSpecificStage = getSpecificStage;
function about(req, res) {
    res.render('about', {
        title: "Leaking Data - About"
    });
}
exports.about = about;
function video(req, res) {
    res.render('video', {
        title: "Leaking Data - Intro"
    });
}
exports.video = video;
function done(req, res) {
    res.render('done', {
        title: "Leaking Data - End"
    });
}
exports.done = done;

