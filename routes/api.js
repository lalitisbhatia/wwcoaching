//################################################
//############### Data SERVICES  #################
//################################################
var mongo = require("mongodb");
var guid = require("guid");
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
        collection.findOne({'_id':id},{Password:0}, function(err, item) {
            res.send(item);
        });
    });
     
});
};

exports.getCoachInfo = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();
    console.log('Retrieving user: ' + id);
    db.collection(coachesCollName, function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
             if(err){
                console.log('no user found: '+ err);
            }
            console.log(item);
            res.send(item);
        });
    });
     
});
};
     
exports.addCoach = function(req, res) {helper.getConnection(function(err,db){
    var coach = req.body;
    coach._id= guid.create().value.toString();
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

    var coach = req.body;
    console.log('Updating coach: ' + coach._id);
    console.log((coach));
    db.collection(coachesCollName, function(err, collection) {
        collection.update({'_id':coach._id}, coach, {safe:true}, function(err, result) {
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

exports.deleteCoach = function(req, res) {helper.getConnection(function(err,db){

    var coach = req.body;
    console.log('Deleting coach: ' + coach._id);

    db.collection(coachesCollName, function(err, collection) {
        collection.remove({'_id':coach._id}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error deleting coach: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send('success');
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
        collection.find().sort({FirstName:1,LastName:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
});
};



exports.getUserById = function(req, res) {helper.getConnection(function(err,db){
    var id = req.params.id.toString();
    console.log('Retrieving user: ' + id);
    db.collection(usersCollName, function(err, collection) {
        collection.findOne({'_id':id},{Password:0}, function(err, item) {
            console.log(item);
            res.send(item);
        });
    });
     
});
};


 
exports.getUsersByCoachId = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();//here the userId is the coach id
    /***************************************/
    /* HARDCODED COACH ID - TO BE REMOVED */
    /***************************************/
//    id='94d1a323-cf5a-4805-b63c-d5a8f66fb616';
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
    user._id= guid.create().value.toString();
    console.log('new user id = ' + user._id);
    db.collection(usersCollName, function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send('success');
            }
        });
    });
});
};


exports.updateUser = function(req, res) {helper.getConnection(function(err,db){

    var user = req.body;
    console.log('Updating user: ' + user._id);
    //console.log(JSON.stringify(user));
    db.collection(usersCollName, function(err, collection) {
        collection.update({'_id':user._id}, user, {safe:true}, function(err, result) {
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

exports.deleteUser = function(req, res) {helper.getConnection(function(err,db){

    var user = req.body;
    console.log('Deleting user: ' + user._id);
    //console.log(JSON.stringify(user));
    db.collection(usersCollName, function(err, collection) {
        collection.remove({'_id':user._id}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error deleting user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) deleted');
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
        //first remove the note
        collection.update({_id:note.userid},{$pull:{CallNotes:{callid:note.callid}}}, function(err, item) {
            if (!err) {
                console.log('successfully removed note');

                //now add the note with updated values
                collection.update({'_id':note.userid},{"$push":{"CallNotes":note}}, { upsert: true }, function(err, result) {
                if (err) {
                    res.send({'error':'error occurred while saving the call note'});
                    } else {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        res.send(result[0]);
                    }
                });

                res.render('user',item);
            } else {
                res.send({'error': 'error occurred while saving the call note' + err});
            }
        });
    });
});
};

exports.deleteCallNote = function(req, res) {helper.getConnection(function(err,db){
    var note = req.body;

    console.log(note);

    db.collection(usersCollName, function(err, collection) {
        //first remove the note
        collection.update({_id:note.userid},{$pull:{CallNotes:{callid:note.callid}}}, function(err, item) {
            if (!err) {
                console.log('successfully removed note');

                res.render('user',item);
            } else {
                res.send({'error': 'error occurred while saving the call note' + err});
            }
        });
    });
});
};
exports.addCallNote = function(req, res) {helper.getConnection(function(err,db){
    var note = req.body;
    console.log(note);
    db.collection(usersCollName, function(err, collection) {
        collection.update({'_id':note.userid},{"$push":{"CallNotes":note}}, { upsert: true }, function(err, result) {
            if (err) {
                res.send({'error':'error occurred while saving the call note'});
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send(result[0]);
            }
        });
    });
});
};
//################################################
//################  SCHEDULER  ###################
//################################################
var schCollName = 'scheduler';



//################################################
//##### user view/action  methods ###########
//################################################

//This is the schedule that users sees - which coaches are available when
//exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
//    db.collection(schCollName, function(err, collection) {
//        collection.find().toArray(function(err, items) { //add logic filters
//            res.send(items);
//        });
//    });
//});
//};

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

//see a coach's availability
exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();//here the userId is the coach id
    console.log('Retrieving availability for coachId: ' + id);
    db.collection(schCollName, function(err, collection) {
        collection.findOne({"Coach.coachId":id}, function(err, item) {
            if (err) {
                res.send({'error':'error occurred while getting coach availabilities'});
            } else {
                if(item) {
                    console.log(item);
                    res.send(item);
                }else{
                    console.log('no results found');
                }
            }
        });
    });
     
});
};

exports.deleteCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var note = req.body;

    console.log(note);

    db.collection(usersCollName, function(err, collection) {
        //first remove the note
        collection.update({_id:note.userid},{$pull:{CallNotes:{callid:note.callid}}}, function(err, item) {
            if (!err) {
                console.log('successfully removed note');

                res.render('user',item);
            } else {
                res.send({'error': 'error occurred while saving the call note' + err});
            }
        });
    });
});
};
exports.addCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var coach = req.body.Coach;
    var schedules = req.body.Dates;
    console.log(coach);
    console.log(schedules);
    //first check if the coach exists
    db.collection(schCollName, function(err, collection) {
        collection.findOne({"Coach.coachId":coach._id}, function(err, item) {
            if(err){
                console.log('error inserting coach schedule');
            }else {
                if(item) {
                    console.log('updating appointments array');
                    //remove all appts and re-insert
                    collection.update({"Coach.coachId":coach._id},{$unset:{Appointments:{}}}, function(err, item){
                        if (err) {
                            res.send({'error':'An error removing appointmets coach '+ err});
                        }else {
                            //now add the appointments
                            collection.update({"Coach.coachId":coach._id},{$set:{Appointments:schedules}}, function(err, item){
                                if(err){
                                    res.send({'error':'An error updating appointmets coach '+ err});
                                }else{
                                    res.send(item);
                                }
                            });
                        }
                    });
                    res.send(item);
                }else {
                    console.log('coach does not exist in scheduler yet - inserting coach schedule');
                    collection.insert(
                                {'Coach':{'coachId':coach._id,'coachName':coach.FirstName + coach.LastName,'coachEmail':coach.Email,'coachPhone':coach.Phone},'Appointments':schedules}, {safe:true}, function(err, result) {
                        if (err) {
                            res.send({'error':'An error inserting coach'});
                        } else {
                            console.log('Success: ' + (result[0]));
                            res.send(result[0]);
                        }
                    });

                }
            }
        });
    });

});
};

//################################################
//##### Emailing API  methods ###########
//################################################
