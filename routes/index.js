
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
        res.render('index', {
            title: seq.title,
            imgUrl: img.url,
            imgId: img._id
        });
    });
}
exports.index = index;
function addComment(req, res) {
    commentHelper.insertNewComment(req.params.imageId, req.params.username, parseFloat(req.params.x), parseFloat(req.params.y), parseFloat(req.params.width), parseFloat(req.params.height), req.params.title, req.params.text, function (error) {
        res.render('postResp', {
        });
    });
}
exports.addComment = addComment;

