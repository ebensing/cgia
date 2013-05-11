
var async = require('async');
var sequences = require("../providers/SequenceProvider")
var images = require("../providers/ImageProvider")
var comments = require("../providers/CommentProvider")
var fs = require("fs")
var sequenceHelper = new sequences.SequenceProvider("Localhost", 27017);
var imageHelper = new images.ImageProvider("Localhost", 27017);
var commentHelper = new comments.CommentProvider("Localhost", 27017);
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
            prevStage: (cStg - 1),
            enableComments: false,
            urlAdd: '/all',
            votes: img.votes
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
            prevStage: (cStg - 1),
            enableComments: false,
            urlAdd: '/curated',
            votes: img.votes
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
            prevStage: (parseInt(req.params.stage) - 1),
            enableComments: false,
            urlAdd: '',
            votes: img.votes
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
        title: "HUIT Careers - Instructions"
    });
}
exports.instructions = instructions;
function doVote(req, res) {
    imageHelper.voteForImageById(req.params.id, function (error) {
        res.render('postResp', {
        });
    });
}
exports.doVote = doVote;
function map(req, res) {
    var jsonMap = JSON.parse(fs.readFileSync("img_map.json", "utf8").toString());
    var map_data = [
        [
            {
                title: 'Cross Functional Management',
                itemStrs: [
                    'IT Management'
                ],
                items: []
            }, 
            {
                title: 'Project Management',
                itemStrs: [
                    'Program Management', 
                    'Project Management', 
                    'Project Coordination'
                ],
                items: []
            }, 
            {
                title: 'Business Analysis and Design',
                itemStrs: [
                    'Product Management', 
                    'Business Systems Design', 
                    'Business Systems Analysis'
                ],
                items: []
            }, 
            {
                title: 'Applications Development & Integration',
                itemStrs: [
                    'Applications Mgmt', 
                    'Data Architecture', 
                    'Applications Architecture', 
                    'Application Development'
                ],
                items: []
            }
        ], 
        [
            {
                title: 'Quality Assurance',
                itemStrs: [
                    'Quality Assurance Management', 
                    'Quality Assurance'
                ],
                items: []
            }, 
            {
                title: 'Release and Configuration Management',
                itemStrs: [
                    'Release Management', 
                    'Release Analysis', 
                    'Service Management', 
                    'Configuration Management'
                ],
                items: []
            }, 
            {
                title: 'Database Administration',
                itemStrs: [
                    'Database Management', 
                    'Database Architecture', 
                    'Database Administration'
                ],
                items: []
            }, 
            {
                title: 'User Support and Customer and Client Services',
                itemStrs: [
                    'User Support Management', 
                    'Tech / Field Support', 
                    'Help Desk / User Support', 
                    'Product Specialist'
                ],
                items: []
            }
        ], 
        [
            {
                title: 'Server and Systems Engineering and Administration',
                itemStrs: [
                    'Systems Management', 
                    'Systems Architecture', 
                    'Systems Engineering', 
                    'Web Administration', 
                    'Systems Administration'
                ],
                items: []
            }, 
            {
                title: 'Operations Management',
                itemStrs: [
                    'Data Center Management', 
                    'Shift Management'
                ],
                items: []
            }, 
            {
                title: 'Hosting Data Storage',
                itemStrs: [
                    'Data Storage Management', 
                    'Data Storage Engineering', 
                    'Data Storage Administration'
                ],
                items: []
            }, 
            {
                title: 'Network Engineering',
                itemStrs: [
                    'Network Management', 
                    'Network Architecture', 
                    'Network Engineering', 
                    'Network Administration', 
                    'Telecomm Mgmt', 
                    'Telecomm Administration'
                ],
                items: []
            }
        ], 
        [
            {
                title: 'IT Security',
                itemStrs: [
                    'IT Security Management', 
                    'IT Security Architecture', 
                    'IT Security Engineering', 
                    'IT Security Response, Research & Analysis'
                ],
                items: []
            }, 
            {
                title: 'User Experience',
                itemStrs: [
                    'User Experience', 
                    'Usability Testing & Design', 
                    'Experience Research & Modeling'
                ],
                items: []
            }, 
            {
                title: 'Media Services',
                itemStrs: [
                    'Digital Media Management', 
                    'Video Engineering', 
                    'Media Technology', 
                    'Video Production', 
                    'Classroom Support', 
                    'Digital Imaging'
                ],
                items: []
            }, 
            {
                title: 'Educational Technology',
                itemStrs: [
                    'Instructional Design', 
                    'Classroom Design', 
                    'Multimedia Engineering', 
                    'Multimedia Design', 
                    'Multimedia Production', 
                    'Applications Development', 
                    'Education Technology Consulting'
                ],
                items: []
            }
        ], 
        
    ];
    for(var i = 0; i < map_data.length; i++) {
        for(var x = 0; x < map_data[i].length; x++) {
            for(var z = 0; z < map_data[i][x].itemStrs.length; z++) {
                if(map_data[i][x].itemStrs[z] in jsonMap) {
                    map_data[i][x].items.push({
                        title: map_data[i][x].itemStrs[z],
                        disabled: false,
                        url: '/stage/' + jsonMap[map_data[i][x].itemStrs[z]].toString()
                    });
                } else {
                    map_data[i][x].items.push({
                        title: map_data[i][x].itemStrs[z],
                        disabled: true
                    });
                }
            }
        }
    }
    res.render('map', {
        title: "HUIT Careers - Instructions",
        rows: map_data
    });
}
exports.map = map;
