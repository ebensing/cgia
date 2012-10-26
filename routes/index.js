
var async = require('async');
var sequences = require("../providers/SequenceProvider")
var images = require("../providers/ImageProvider")
var comments = require("../providers/CommentProvider")
var sequenceHelper = new sequences.SequenceProvider("localhost", 27017);
var imageHelper = new images.ImageProvider("localhost", 27017);
var commentHelper = new comments.CommentProvider("localhost", 27017);
function index(req, res) {
    async.waterfall([
        function (cb) {
            sequenceHelper.getActiveSequence(cb);
        }, 
        function (seq, cb) {
            imageHelper.getImageById(seq.imageIds[0], function (e, img) {
                cb(e, seq, img);
            });
        }    ], function (error, seq, img) {
        var stage = seq.imageIds.length > 1 ? 2 : 0;
        res.render('index', {
            title: seq.title + " - " + img.title,
            imgUrl: img.url,
            imgId: img._id,
            comments: [],
            stage: stage
        });
    });
}
exports.index = index;
function addComment(req, res) {
    commentHelper.insertNewComment(req.body.imageId, req.body.nameTxt, parseFloat(req.body.xTxt), parseFloat(req.body.yTxt), parseFloat(req.body.widthTxt), parseFloat(req.body.heightTxt), req.body.titleTxt, req.body.commentTxt, function (error) {
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
            imageHelper.getImageById(seq.imageIds[0], function (e, img) {
                cb(e, seq, img);
            });
        }, 
        function (seq, img, cb) {
            commentHelper.getAllCommentsByImageId(req.params.imageId, function (error, cmmts) {
                cb(error, seq, img, cmmts);
            });
        }    ], function (error, seq, img, cmmts) {
        res.render('index', {
            title: seq.title,
            imgUrl: img.url,
            imgId: img._id,
            comments: cmmts
        });
    });
}
exports.showAllComments = showAllComments;
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
        var stage = seq.imageIds.length > (parseInt(req.params.stage) + 1) ? (parseInt(req.params.stage) + 1) : 0;
        res.render('index', {
            title: seq.title + " - " + img.title,
            imgUrl: img.url,
            imgId: img._id,
            comments: [],
            stage: stage
        });
    });
}
exports.getSpecificStage = getSpecificStage;

