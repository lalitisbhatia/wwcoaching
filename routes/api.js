//################################################
//############### Data Services  #################
//################################################
var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;


//################################################
//##### Coach ###########
//################################################
var coachesCollName = 'coaches';

exports.getAllCoaches = function(req, res) {helper.getConnection(function(err,db){
    db.collection(coachesCollName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
});
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


//################################################
//##### USER ###########
//################################################
var usersCollName = 'users';

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


 
exports.getUsersByCoachId = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();//here the userId is the coach id
    /***************************************/
    /* HARDCODED COACH ID - TO BE REMOVED */
    /***************************************/
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

/********************************************************************
 * CALL NOTES CRUD
 *******************************************************************/

exports.getCallNotes = function(req, res) {helper.getConnection(function(err,db){
    var userid = req.params.userid;
    console.log('userid: ' + userid);
    // db.collection(usersCollName, function(err, collection) {
    //     collection.find({'CoachId':id}).toArray(function(err, items) {
    //         res.send(items);
    //     });
    // });
});
};

exports.updateCallNote = function(req, res) {helper.getConnection(function(err,db){
    var note = req.body;
    console.log(note);
    
    db.collection(usersCollName, function(err, collection) {
        collection.update({'_id':note.userid},{CallNotes:{$elemMatch:{callid:note.callid}}},{$set:{"date":note.date,"duration":note.duration,"note":note.note}}, function(err, item) {
            //console.log(item);
            res.send(item);
            //res.render('user',item);
        });
    });
    
    //  db.collection(usersCollName, function(err, collection) {
    //      var item = usersCollName.findOne({'_id':note.userid,CallNotes:{callid:note.callid}});
    //      res.send(item);
    // //     collection.update({$and:[{'_id':note.userid},{"CallNotes":{"callid":note.callid}}]},{"date":note.date,"duration":note.duration,"note":note.note}, { upsert: true }, function(err, result) {
    //         if (err) {
    //             res.send({'error':'error occurred while saving the call note'});
    //         } else {
    //             console.log('Success: ' + JSON.stringify(result[0]));
    //             res.send('successful update - ' + result);
    //         }
    //     });
     //});
    
    
    
});
};

function noteExists(userid,noteid){helper.getConnection(function(err,db){
    var projection = {'_id':userid,CallNotes:{callid:noteid}};
    var item = db.usersCollName.findOne({'_id':userid,CallNotes:{callid:noteid}});
     return item;
});
}

exports.addCallNote = function(req, res) {helper.getConnection(function(err,db){
    var note = req.body;
    console.log(note);
    db.collection(usersCollName, function(err, collection) {
        collection.update({'_id':note.userid},{"$push":{"CallNotes":{"callid":note.callid,"date":note.date,"duration":note.duration,"note":note.note}}}, { upsert: true }, function(err, result) {
            if (err) {
                res.send({'error':'error occurred while saving the call note'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
});
};
//################################################
//################  SCHEDULER  ###################
//################################################
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
