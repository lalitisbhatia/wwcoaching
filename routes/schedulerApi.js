//################################################
//############### Data Services  #################
//################################################

var helper = require('../public/lib/dbhelper');


var schCollName = 'scheduler';

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
                        {'Coach':{'coachId':coach._id,'coachName':coach.FirstName + ' ' + coach.LastName,'coachEmail':coach.Email,'coachPhone':coach.Phone},'Appointments':schedules}, {safe:true}, function(err, result) {
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

exports.getAllAvails = function(req, res) {helper.getConnection(function(err,db){

    console.log('Retrieving availability of all coaches');
    db.collection('schedule', function(err, collection) {
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


/*
 ########################## Rewritten ########################
 */
exports.getCoachAvails = function(req, res) {helper.getConnection(function(err,db){
    var id = req.session.userId.toString();//here the userId is the coach id
    console.log('Retrieving availability for coachId: ' + id);
    db.collection('schedule', function(err, collection) {
        collection.find({"Appointments":{$elemMatch:{"coachId":id}}},{Date:1,Time:1,_id:0}).toArray(function(err, item) {
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
