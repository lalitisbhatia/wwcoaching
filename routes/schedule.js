//##### Services related to Schedule info ###########
//################################################
var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;

var schCollName = 'schedule';



//################################################
//##### user view/action  methods ###########
//################################################

//This is the schedule that users sees - which coaches are available when
exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    db.collection(schCollName, function(err, collection) {
        collection.find().toArray(function(err, items) { //add logic filters
            res.send(items);
        });
    });
});
};

//method to allow users to choose an available slot
exports.getAppts = function(req, res) {helper.getConnection(function(err,db){
    db.collection(schCollName, function(err, collection) {
        collection.find().toArray(function(err, items) { //add logic filters
            res.send(items);
        });
    });
});
};

//################################################
//##### coach view/action  methods ###########
//################################################

//see scheduled appts
exports.getCoachApptsById = function(req, res) {helper.getConnection(function(err,db){
  var id = req.params.id.toString();
    //console.log('Retrieving user: ' + id);
    db.collection(schCollName, function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            //res.send(item);
            res.render('user',item);
        });
    });
     
});
};




