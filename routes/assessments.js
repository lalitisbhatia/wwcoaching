//##### Services related to Assessment info ###########
//################################################
var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;

var assmCollName = 'assessments';



//################################################
//##### Services methods ###########
//################################################


exports.getAssmByUserId = function(req, res) {helper.getConnection(function(err,db){
  var userId = req.params.id;
    console.log('Retrieving assmnt: ' + userId);
    db.collection(assmCollName, function(err, collection) {
        collection.findOne({'Assessment.UserId':userId}, function(err, item) {
            if(err){
                console.log('Error getting assessment for userid :' + userId)
            }else {
                console.log(item);
                res.send(item);
            }
        });
    });
     
});
};
     
exports.saveAssm = function(req, res) {helper.getConnection(function(err,db){
    var assm = req.body;
    console.log(req.body);
    var assmDate = new Date();
    assm.AssmDate = assmDate.toISOString();
    console.log(req.session.user.assessment);

    db.collection(assmCollName, function(err, collection) {
        if(req.session.user.assessment){
            collection.update({'Assessment.UserId':req.session.user._id},{$set:{Assessment:assm}},{safe: true}, function (err, result) {
                if (err) {
                    res.send({'error': 'An error has occurred: '+ err});
                } else {
                    console.log('Success: ');

                }
            });
        }else {
            collection.insert({Assessment:assm}, {safe: true}, function (err, result) {
                if (err) {
                    res.send({'error': 'An error has occurred inserting the assessment: '+ err});
                } else {
                    console.log('Success: ');
                }
            });
        }
        req.session.user.assessment=true;
        res.render('confirmation');
    });
});
};




