//################################################
//############### Data SERVICES  #################
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
    var currDate = new Date(req.params.currDate);
    //console.log('search type= ' +type);
    //console.log('curr date param= ' +currDate);
    var query={};
    var limitResults=12;
    currDate.setHours(currDate.getHours()+4);//move forward by 4 hours from the current time to give coaches enough time
    var queryDate; //this is the date that'll be used in the query depending on the search and current date


    //console.log('curr date after updating hours= ' +currDate);
    if(type=='date'){

        var inputUTCDate =new Date(req.params.value);
        var timeForward = new Date(inputUTCDate);
        var timeBack = new Date(inputUTCDate);

        timeForward.setHours(timeForward.getHours()+12);
        //console.log(timeForward.toISOString());
        //console.log(timeBack.toISOString());

        //if input date is 4 hour further than current date, use it, otherwise use current date + 4 hours
        if(currDate<=timeBack){
            queryDate=timeBack;
        }else{
            queryDate=currDate;
        }
        //console.log('query date = '+ queryDate.toISOString());
        //{DateUTC:{$gte:timeBack.toISOString()}},
        query={DateUTC:{$gte:queryDate.toISOString()},User:{$exists:false}};

    }else if(type=='coach'){
        var coachId = req.params.value;
        //console.log('coach id = ' + coachId);
        query={"Coach.coachId":coachId,User:{$exists:false},DateUTC:{$gte:currDate.toISOString()}};
    }

//    console.log('Retrieving availability of  coaches for '+ timeForward.toISOString() );
    db.collection(schCollName, function(err, collection) {
        collection.find(query).sort({DateUTC:1}).limit(limitResults).toArray(function(err, items) {
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
    //console.log(today.toISOString());

    query={"User._id":userId,DateUTC:{$gte:today.toISOString()}};

    db.collection(schCollName, function(err, collection) {
        collection.find(query).toArray(function(err, items) {
            if (err) {
                res.send({'error':'error occurred while getting all availabilities'});
            } else {
                if(items) {
                    //console.log(items);
                    res.send(items);
                }else{
                    console.log('no user appts found');
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
    //console.log('coach id = ' + coachId);

    var today =new Date();
    //console.log(today.toISOString());

    query={"Coach.coachId":coachId,User:{$exists:true}};

    db.collection(schCollName, function(err, collection) {
        collection.find(query).toArray(function(err, items) {
            if (err) {
                res.send({'error':'error occurred while getting coach\'s upcoming appointments'});
            } else {
                if(items) {
                    //console.log(items);
                    res.send(items);
                }else{
                    console.log('no coach appts found');
                }
            }
        });
    });

});
};

//this is to build the calendar - Get avails only for a range of dates
exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var startDate = new Date(req.params.d1);
    var endDate = new Date(req.params.d2);

    endDate.setDate(endDate.getDate()+1);
    startDate.setDate(startDate.getDate()+1);
    console.log(startDate);
    console.log(endDate);
    var id = req.session.userId.toString();//here the userId is the coach id
    console.log('Retrieving availability for coachId: ' + id);
    db.collection('schedule', function(err, collection) {
        collection.find({$and:[{"Coach.coachId":id},{DateUTC:{$gte:startDate.toISOString()}},{DateUTC:{$lte:endDate.toISOString()}}]}).toArray(function(err, item) {
            if (err) {
                res.send({'error':'error occurred while getting coach availabilities' + err});
            } else {
                if(item) {
                    console.log(item.length);
                    res.send(item);
                }else{
                    console.log('no results found');
                }
            }
        });
    });

});
};

exports.getAllCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    console.log('Retrieving availability for all coaches: ');
    var d1=new Date(req.params.d1);
    console.log('d1 = ' + d1);
    var month ;
    var dt;
    if(d1.getMonth()+1<10){
        month = '0'+(d1.getMonth()+1).toString();
    }else
    {
        month = (d1.getMonth()+1).toString();
    }

    if(d1.getDate()<10){
        dt = '0'+(d1.getDate()).toString();
    }else
    {
        dt = (d1.getDate()).toString();
    }
    var date= (month + '/' +dt + '/' + d1.getFullYear());
    console.log('date = ' + date);
    db.collection('schedule', function(err, collection) {
        collection.find({Date:date}).sort({DateUTC:1,"Coach.coachName":1}).toArray(function(err, item) {
            if (err) {
                res.send({'error':'error occurred while getting full schedule'});
            } else {
                if(item) {
                    console.log(item.length);
                    res.send(item);
                }else{
                    console.log('no results found');
                }
            }
        });
    });

});
};

// Save coach availability for a range of dates
exports.saveCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var coachId = req.body.CoachId;
    var schedules = req.body.TimeSlots;
    var startDate = new Date(req.body.d1);
    var endDate = new Date(req.body.d2);

    endDate.setDate(endDate.getDate()+1);
    startDate.setDate(startDate.getDate()+1);
    console.log(startDate);
    console.log(endDate);

    console.log(req.body);
    //console.log('printing schedules');
    //console.log(schedules);
    //first check if the coach exists
    db.collection(schCollName, function(err, collection) {
        //empty out the coach's schedule for the input dates
        collection.remove({$and:[{"Coach.coachId":coachId},{DateUTC:{$gte:startDate.toISOString()}},{DateUTC:{$lte:endDate.toISOString()}}]}, function (err, item) {
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
                }else{
                    res.send('no data to insert');
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

    //console.log('date :' + date);
    //console.log('userId :' + userId);
    //console.log('coachId :' + coachId);

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
                            //res.send('success');
                        }
                    })
                });
                // }


                //now get all the user appts and send them back
                var query={};
                var today =new Date();
                //console.log(today.toISOString());

                query={"User._id":userId,DateUTC:{$gte:today.toISOString()}};

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
    var userId = req.session.user._id;

    //console.log('date :' + date);
    //console.log('coachId :' + coachId);

    db.collection(schCollName, function(err, collection) {
        collection.update({DateUTC:date,"Coach.coachId":coachId}, {$unset:{User:""}}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating schedule: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');

                //now get all the user appts and send them back
                var query={};
                var today =new Date();
                //console.log(today.toISOString());

                query={"User._id":userId,DateUTC:{$gte:today.toISOString()}};

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

            }
        });

    });

});
};