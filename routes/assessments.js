//##### Services related to Assessment info ###########
//################################################
var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;

var assmCollName = 'assessments';



//################################################
//##### Services methods ###########
//################################################


exports.getAssmById = function(req, res) {helper.getConnection(function(err,db){
  var id = req.params.id.toString();
    //console.log('Retrieving assmnt: ' + id);
    db.collection(assmCollName, function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            res.send(item);
        });
    });
     
});
};
     
exports.saveAssm = function(req, res) {helper.getConnection(function(err,db){
    var assm = req.body;
    console.log(req.body);
    res.send('thanks');
//    db.collection(assmCollName, function(err, collection) {
//        collection.insert(assm, {safe:true}, function(err, result) {
//            if (err) {
//                res.send({'error':'An error has occurred'});
//            } else {
//                console.log('Success: ' + JSON.stringify(result[0]));
//                res.send(result[0]);
//            }
//        });
//    });
});
};




