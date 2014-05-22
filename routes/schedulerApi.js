//################################################
//############### Data Services  #################
//################################################

var helper = require('../public/lib/dbhelper');


var schCollName = 'schedule';

//################################################
//##### scheduler APIs ###########
//################################################

//see a coach's availability
//exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
//    var id = req.session.userId.toString();//here the userId is the coach id
//    console.log('Retrieving availability for coachId: ' + id);
//    db.collection(schCollName, function(err, collection) {
//        collection.find({"Coach.coachId":id}, function(err, item) {
//            if (err) {
//                res.send({'error':'error occurred while getting coach availabilities'});
//            } else {
//                if(item) {
//                    console.log(item);
//                    res.send(item);
//                }else{
//                    console.log('no results found');
//                }
//            }
//        });
//    });
//
//});
//};


//exports.addCoachAvails = function(req, res) {helper.getConnection(function(err,db){
//    var coach = req.body.Coach;
//    var schedules = req.body.Dates;
//    console.log(coach);
//    console.log(schedules);
//    //first check if the coach exists
//    db.collection(schCollName, function(err, collection) {
//        collection.findOne({"Coach.coachId":coach._id}, function(err, item) {
//            if(err){
//                console.log('error inserting coach schedule');
//            }else {
//                if(item) {
//                    console.log('updating appointments array');
//                    //remove all appts and re-insert
//                    collection.update({"Coach.coachId":coach._id},{$unset:{Appointments:{}}}, function(err, item){
//                        if (err) {
//                            res.send({'error':'An error removing appointmets coach '+ err});
//                        }else {
//                            //now add the appointments
//                            collection.update({"Coach.coachId":coach._id},{$set:{Appointments:schedules}}, function(err, item){
//                                if(err){
//                                    res.send({'error':'An error updating appointmets coach '+ err});
//                                }else{
//                                    res.send(item);
//                                }
//                            });
//                        }
//                    });
//                    res.send(item);
//                }else {
//                    console.log('coach does not exist in scheduler yet - inserting coach schedule');
//                    collection.insert(
//                        {'Coach':{'coachId':coach._id,'coachName':coach.FirstName + ' ' + coach.LastName,'coachEmail':coach.Email,'coachPhone':coach.Phone},'Appointments':schedules}, {safe:true}, function(err, result) {
//                            if (err) {
//                                res.send({'error':'An error inserting coach'});
//                            } else {
//                                console.log('Success: ' + (result[0]));
//                                res.send(result[0]);
//                            }
//                        });
//
//                }
//            }
//        });
//    });
//});
//};

exports.getAllAvails = function(req, res) {helper.getConnection(function(err,db){

    console.log('Retrieving availability of all coaches');
    db.collection(schCollName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            if (err) {
                res.send({'error':'error occurred while getting all availabilities'});
            } else {
                if(items) {
                    console.log(items);
                    res.send(items);
                }else{
                    console.log('no results found');
                }
            }
        });
    });

});
};

/*************************************
    USER Search for available slots
 *************************************/
exports.searchAvails = function(req, res) {helper.getConnection(function(err,db){
    console.log(req.params.datetime.toString());
    var inputUTCDate =new Date(req.params.datetime);

    var timeForward = new Date(inputUTCDate);
    var timeBack = new Date(inputUTCDate);
    timeForward.setHours(timeForward.getHours()+10);
    timeBack.setHours(timeBack.getHours()-2);

    console.log(timeForward.toISOString());
    console.log(timeBack.toISOString());


    console.log('Retrieving availability of  coaches for '+ timeForward.toISOString() );
    db.collection(schCollName, function(err, collection) {
        collection.find({DateUTC:{$gte:timeBack.toISOString(),$lte:timeForward.toISOString()},User:{$exists:false}}).toArray(function(err, items) {
            if (err) {
                res.send({'error':'error occurred while getting all availabilities'});
            } else {
                if(items) {
                    console.log(items);
                    res.send(items);
                }else{
                    console.log('no results found');
                }
            }
        });
    });

});
};


/*
 ########################## Rewritten ########################
 */
exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();//here the userId is the coach id
    console.log('Retrieving availability for coachId: ' + id);
    db.collection('schedule', function(err, collection) {
        collection.find({"Coach.coachId":id}).toArray(function(err, item) {
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

exports.addCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var coachId = req.body.CoachId;
    var schedules = req.body.TimeSlots;
    //console.log(req.body);
    console.log('printing schedules');
    console.log(schedules);
    //first check if the coach exists
    db.collection(schCollName, function(err, collection) {
        collection.remove({"Coach.coachId": coachId}, function (err, item) {
            if (err) {
                console.log('error removing coach schedule');
            } else {
                //now add the array to the collection if its not empty
                if(schedules.length>0){
                    collection.insert(schedules, {safe: true}, function (err, result) {
                        console.log('inserting appointments array');
                        if (err) {
                            res.send({'error': 'An error inserting appointments for coach ' + err});
                        } else {
                            console.log('SUCCESS inserting appointments array');
                            res.send(result);
                        }
                    });
                }
            }
        });
    });
});
};

exports.saveUserAppt = function(req, res) {helper.getConnection(function(err,db){

    console.log('Saving Schedule');
    var date = req.body.Date;
    var userId = req.session.userId;
    var user = req.session.user;
    var coachId = req.body.CoachId;
    console.log('date :' +date);
    console.log('userId :' +userId);
    console.log('coachId :' +coachId);

    db.collection(schCollName, function(err, collection) {
        collection.update({DateUTC:date,"Coach.coachId":coachId}, {$set:{User:user}}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating schedule: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send('success');
            }
        });
    });

});
};