
var async = require('async');
var sequences = require("../providers/SequenceProvider")
var images = require("../providers/ImageProvider")
var comments = require("../providers/CommentProvider")
var sequenceHelper = new sequences.SequenceProvider("Akroma", 27017);
var imageHelper = new images.ImageProvider("Akroma", 27017);
var commentHelper = new comments.CommentProvider("Akroma", 27017);
function index(req, res) {
    res.render('home', {
        title: "HUIT - Home"
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
        var cStg = parseInt(req.params.stage);
        var stage = seq.imageIds.length > cStg ? cStg + 1 : 0;
        res.render('index', {
            title: seq.title + " - " + img.title,
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
        var cStg = parseInt(req.params.stage);
        var stage = seq.imageIds.length > cStg ? cStg + 1 : 0;
        res.render('index', {
            title: seq.title + " - " + img.title,
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
function done(req, res) {
    res.render('done', {
        title: "HUIT - End"
    });
}
exports.done = done;
function instructions(req, res) {
    res.render('instructions', {
        title: "Leaking Data - Instructions"
    });
}
exports.instructions = instructions;

