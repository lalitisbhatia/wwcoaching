//##### API routes handlers related to user info ###########
//##########################################################
var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;

var usersCollName = 'users';



//################################################
//##### SERVICES methods ###########
//################################################
exports.getAllUsers = function(req, res) {helper.getConnection(function(err,db){
    db.collection(usersCollName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
});
};



exports.getUserById = function(req, res) {helper.getConnection(function(err,db){
    var id = req.params.id.toString();
    console.log('Retrieving user: ' + id);
    db.collection(usersCollName, function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            //console.log(item);
            res.send(item);
            //res.render('user',item);
        });
    });
     
});
};

// exports.getUsersByCoachId = function(req, res) {helper.getConnection(function(err,db){
//   var id = req.session.userId.toString(); // the userid here is the coach id
//     //console.log('Retrieving user: ' + id);
//     db.collection(usersCollName, function(err, collection) {
//         collection.find().toArray(function(err, items) {
//             res.send(items);
//         });
//     });
     
// });
// };
 
exports.getUsersByCoachId = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();
    id='81b97fab-851a-41e6-9468-d368870d6957';
    console.log('coachId: ' + id);
    db.collection(usersCollName, function(err, collection) {
        collection.find({'CoachId':id}).toArray(function(err, items) {
            res.send(items);
        });
    });
});
};
    
exports.addUser = function(req, res) {helper.getConnection(function(err,db){
    var user = req.body;
    db.collection(usersCollName, function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
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


exports.updateUser = function(req, res) {helper.getConnection(function(err,db){
    var id = req.params.id;
    var user = req.body;
    //console.log('Updating user: ' + id);
    //console.log(JSON.stringify(user));
    db.collection(usersCollName, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
});
};


