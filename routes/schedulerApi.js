//################################################
//############### Data Services  #################
//################################################

var helper = require('../public/lib/dbhelper');


var schCollName = 'schedule';
var usersCollName = 'users';

//################################################
//##### scheduler APIs ###########
//################################################


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
    var type =req.params.type;
    console.log(type);
    var query={};
    if(type=='date'){

        var inputUTCDate =new Date(req.params.value);
        var timeForward = new Date(inputUTCDate);
        var timeBack = new Date(inputUTCDate);
        timeForward.setHours(timeForward.getHours()+10);
        timeBack.setHours(timeBack.getHours()-2);

        console.log(timeForward.toISOString());
        console.log(timeBack.toISOString());

        query={DateUTC:{$gte:timeBack.toISOString(),$lte:timeForward.toISOString()},User:{$exists:false}};

    }else if(type=='coach'){
        var coachId = req.params.value;
        console.log('coach id = ' + coachId);
        query={"Coach.coachId":coachId,User:{$exists:false}};
    }

//    console.log('Retrieving availability of  coaches for '+ timeForward.toISOString() );
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
                //Now check if the user has a coach associated
                if(req.session.user.CoachId){
                    console.log('user has coach associated');
                }else{
                    db.collection(usersCollName, function(err, userColl) {
                        userColl.update({_id:userId},{$set:{CoachName:coachName,CoachId:coachId}},{safe:true},function(err,res){
                            if(err){
                                console.log('error associating coach to user: '+ err);
                            }else{
                                console.log('associated coach'+coachName +' to userid '+ userId);
                            }
                        })
                    });
                }

                res.send('success');
            }
        });
    });

});
};