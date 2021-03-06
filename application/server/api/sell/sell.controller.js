'use strict';

var _ = require('lodash');
var Sell = require('./sell.model');
var Stats = require('./../stats/stats.controller');
var Buy = require('./../buy/buy.model');

// Get list of sells
exports.index = function(req, res) {
  Sell
    .find()
    .where('match').equals(null)
    .exec(function (err, sells) {
      if(err) { return handleError(res, err); }
      return res.json(200, sells);
    });
};

// Get a single sell
exports.show = function(req, res) {
  Sell.findById(req.params.id, function (err, sell) {
    if(err) { return handleError(res, err); }
    if(!sell) { return res.send(404); }
    return res.json(sell);
  });
};

// Get buys by user
exports.getByUser = function(req, res){
  var userId = req.params.userId;  
  Sell.find({ userId: userId }, function(err, sells){
    if(err) { return handleError(res, err); }
    return res.json(200, sells);
  });
};

// Creates a new sell in the DB.
exports.create = function(req, res) {
  Stats.maxBid(req.body.stock)
    .then(function(maxBid){
      if (maxBid && req.body.price <= maxBid.price) {
        req.body.match = maxBid._id;
        var newSell = new Sell(req.body);
        maxBid.match = newSell._id;

        maxBid.save(function(err){
          if(err) { return handleError(res, err); }

          newSell.save(function(err, sell) {
            if(err) { return handleError(res, err); }
            return res.json(201, sell);
          });
        });
      } else {        
        Sell.create(req.body, function(err, sell) {
          if(err) { return handleError(res, err); }
          return res.json(201, sell);
        });
      }
    });
};

// Updates an existing sell in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sell.findById(req.params.id, function (err, sell) {
    if (err) { return handleError(res, err); }
    if(!sell) { return res.send(404); }
    var updated = _.merge(sell, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sell);
    });
  });
};

// Deletes a sell from the DB.
exports.destroy = function(req, res) {
  Sell.findById(req.params.id, function (err, sell) {
    if(err) { return handleError(res, err); }
    if(!sell) { return res.send(404); }
    sell.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Delete all
exports.deleteAll = function(req, res){
  Sell.find({}).remove(function(err){
    if(err) { return handleError(res, err); }
    res.send(200);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}