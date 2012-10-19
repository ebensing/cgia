
var async = require('async');
var sequences = require("../providers/SequenceProvider")
var images = require("../providers/ImageProvider")
var sequenceHelper = new sequences.SequenceProvider("localhost", 27017);
var imageHelper = new images.ImageProvider("localhost", 27017);
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
            imgUrl: img.url
        });
    });
}
exports.index = index;

