/// <reference path='../nodelib/node.d.ts' />
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};