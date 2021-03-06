//################################################
//##### SERVICES related to coach info ###########
//################################################
var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;

var coachesCollName = 'coaches';



//################################################
//##### SERVICES methods ###########
//################################################
exports.getAllCoaches = function(req, res) {helper.getConnection(function(err,db){
    db.collection(coachesCollName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
});
};

exports.checkUser = function(req, res, next) {
 if (req.session && req.session.auth && req.session.userId && (req.session.user.approved || req.session.admin)) {
 console.info('Access USER: ' + req.session.userId);
 return next();
 } else {
 next('User is not logged in.');
 }
};


exports.getCoachById = function(req, res) {helper.getConnection(function(err,db){
  var id = req.params.id.toString();
    console.log('Retrieving user: ' + id);
    db.collection(coachesCollName, function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            res.send(item);
        });
    });
     
});
};

exports.getCoachInfo = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();
    console.log('Retrieving user: ' + id);
    db.collection(coachesCollName, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
             if(err){
                console.log('no user found: '+ err);
            };
            console.log(item);
            res.send(item);
        });
    });
     
});
};
     
exports.addCoach = function(req, res) {helper.getConnection(function(err,db){
    var coach = req.body;
    db.collection(coachesCollName, function(err, collection) {
        collection.insert(coach, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
});
};


exports.updateCoach = function(req, res) {helper.getConnection(function(err,db){
    var id = req.params.id;
    var coach = req.body;
    //console.log('Updating coach: ' + id);
    //console.log(JSON.stringify(coach));
    db.collection(coachesCollName, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, coach, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating coach: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(coach);
            }
        });
    });
});
};


