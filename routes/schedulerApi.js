//################################################
//############### Data Services  #################
//################################################

var helper = require('../public/lib/dbhelper');


var schCollName = 'schedule';
var usersCollName = 'users';


//################################################
//##### scheduler APIs ###########
//################################################



/*************************************
    USER Search for available slots
 *************************************/
exports.searchAvails = function(req, res) {helper.getConnection(function(err,db){
    var type =req.params.type;
    console.log(type);
    var query={};
    var today =new Date();
    if(type=='date'){

        var inputUTCDate =new Date(req.params.value);
        var timeForward = new Date(inputUTCDate);
        var timeBack = new Date(inputUTCDate);
        timeForward.setHours(timeForward.getHours()+10);
        timeBack.setHours(timeBack.getHours()-2);

        console.log(timeForward.toISOString());
        console.log(timeBack.toISOString());

        query={DateUTC:{$gte:timeBack.toISOString(),$lte:timeForward.toISOString(),$gte:today.toISOString()},User:{$exists:false}};

    }else if(type=='coach'){
        var coachId = req.params.value;
        console.log('coach id = ' + coachId);
        query={"Coach.coachId":coachId,User:{$exists:false},DateUTC:{$gte:today.toISOString()}};
    }

//    console.log('Retrieving availability of  coaches for '+ timeForward.toISOString() );
    db.collection(schCollName, function(err, collection) {
        collection.find(query).toArray(function(err, items) {
            if (err) {
                res.send({'error':'error occurred while getting all availabilities'});
            } else {
                if(items) {
                    //console.log(items);
                    res.send(items);
                }else{
                    console.log('no results found');
                }
            }
        });
    });

});
};

//User's upcoming appts
exports.searchUserAppts = function(req, res) {helper.getConnection(function(err,db){
    console.log('searching user appts' );
    var userId =req.params.id;
    var query={};
    console.log('user id = ' + userId);

    var today =new Date();
    console.log(today.toISOString());

    query={"User._id":userId,DateUTC:{$gte:today.toISOString()}};

    db.collection(schCollName, function(err, collection) {
        collection.find(query).toArray(function(err, items) {
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
/********************************
 ***** Coach's upcoming appts ***
********************************/
exports.searchCoachAppts = function(req, res) {helper.getConnection(function(err,db){
    console.log('searching coach\'s appts' );
    var coachId =req.params.id;
    var query={};
    console.log('coach id = ' + coachId);

    var today =new Date();
    console.log(today.toISOString());

    query={"Coach.coachId":coachId,User:{$exists:true},DateUTC:{$gte:today.toISOString()}};

    db.collection(schCollName, function(err, collection) {
        collection.find(query).toArray(function(err, items) {
            if (err) {
                res.send({'error':'error occurred while getting coach\'s upcoming appointments'});
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

//this is to build the calendar
exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();//here the userId is the coach id
    console.log('Retrieving availability for coachId: ' + id);
    db.collection('schedule', function(err, collection) {
        collection.find({"Coach.coachId":id}).toArray(function(err, item) {
            if (err) {
                res.send({'error':'error occurred while getting coach availabilities'});
            } else {
                if(item) {
                    //console.log(item);
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
    var userId = req.session.user._id;
    var user = req.session.user;
    var coachId = req.body.Coach.coachId;
    var coachName = req.body.Coach.coachName;

    console.log('date :' + date);
    console.log('userId :' + userId);
    console.log('coachId :' + coachId);

    db.collection(schCollName, function(err, collection) {
        collection.update({DateUTC:date,"Coach.coachId":coachId}, {$set:{"User._id":user._id,"User.Email":user.Email,"User.FirstName":user.FirstName,"User.LastName":user.LastName,"User.Phone":user.Phone}}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating schedule: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');

                // Always associate coach with user. This will take care of the situation where the coach is
                // changed and also where its the first association
                db.collection(usersCollName, function(err, userColl) {
                    userColl.update({_id:userId},{$set:{CoachName:coachName,CoachId:coachId}},{safe:true},function(err,result){
                        if(err){
                            console.log('error associating coach to user: '+ err);
                        }else{
                            console.log('associated coach'+coachName +' to userid '+ userId);
                            req.session.user.CoachId=coachId;
                            req.session.user.CoachName=coachName;
                            //console.log('rewriting session');
                            //console.log(req.session.user);
                            res.send('success');
                        }
                    })
                });
                // }


            }
        });
    });

});
};

exports.cancelUserAppt = function(req, res) {helper.getConnection(function(err,db) {
    console.log('cancelling  Appt');
    var date = req.body.Date;
    var coachId = req.body.Coach.coachId;
    var coachName = req.body.Coach.coachName;

    console.log('date :' + date);
    console.log('coachId :' + coachId);

    db.collection(schCollName, function(err, collection) {
        collection.update({DateUTC:date,"Coach.coachId":coachId}, {$unset:{User:""}}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating schedule: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send("appointment cancelled");
            }
        });
    });

});
};