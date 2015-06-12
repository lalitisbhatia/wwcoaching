//###############################################################################
//##### SERVICES related to dasboard admin and coach and participant auth #######
//###############################################################################

var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;
var https = require('https');
var needle = require('needle');
var request = require('request');

var coachesCollName = 'coaches';
var participantsCollName = 'users';
var assessmentCollName = 'assessments';

exports.loginAdmin = function(req, res,next) {helper.getConnection(function(err,db){
    console.log('calling login function for ADMIN');
    //console.log('user: ' + req.body.username);
    //console.log('password: ' + req.body.password);
    db.collection(coachesCollName, function(err, collection) {
        collection.findOne(
            {
                'Username':req.body.username,
                'Password':req.body.password
            }, function(err, item) {
                if(err){
                    console.log(err);
                    res.send('error while looking for admin user: '+ err);
                    return(next(err));
                };

                if(item)
                {
                    //console.log(item);
                    if(item.admin){
                        req.session.auth=true;
                        req.session.userId=item._id;
                        req.session.user=item;
                        req.session.isAdmin=true;
                        //console.log(item);
                    }else{

                        //console.log(item);
                    }
                    console.log('redirecting to /admin');
                    res.redirect('/admin');
                }else
                {
                    console.log('admin user not found');
                    res.render('adminLogin',{'message':'Admin user not found. Please try again'});

                }

            });
    });

});
};

exports.loginCoach = function(req, res,next) {helper.getConnection(function(err,db){
    console.log('calling login function for COACH');
    //console.log('user: ' + req.body.username);
    //console.log('password: ' + req.body.password);
    db.collection(coachesCollName, function(err, collection) {
        collection.findOne({'Username':{$regex:req.body.username,$options:'i'},'Password':{$regex:req.body.password,$options:'i'}},{Username:0,Password:0,EmailPassword:0}, function(err, item) {
                if(err){
                    console.log(err);
                    res.send('error while looking for coach: '+ err);
                    return(next(err));
                };

                if(item)
                {
                    //console.log(item);
                    if(!item.admin) {
                        req.session.auth=true;
                        req.session.userId=item._id;
                        req.session.user=item;
                        req.session.isCoach = true;
                    }
                    //console.log(item);
                    res.redirect('/coach');
                }else
                {
                    console.log('coach not found');
                    res.render('coachLogin',{'message':'Coach credentials are not valid. Please try again'});

                }

            });
    });

});
};

exports.loginParticipant = function(req, res,next) {helper.getConnection(function(err,db){
    console.log('calling login function for Participant');
    //console.log('logging request object');
    //console.log(req.body);
    //var fn = req.body.firstname;
    //var ln = req.body.lastname;
    var un = req.body.Username;
    //var WWInfo = req.body.WWInfo;
    var wwloginInfo = req.body.WWLoginInfo;
    //console.log('wwloginInfo');
    //console.log(wwloginInfo);

    var retData= {};

    /**************************************************************/
    //first authenticate WW credentials
    /**************************************************************/
    var strLoginInfo = JSON.stringify(wwloginInfo);
    var options = {
        headers: {'Content-Type': 'application/json'}
    };
    needle.post ('https://mobile.weightwatchers.com/authservice.svc/login',strLoginInfo,options,function(err, resp, body){
        console.log('inside needle post');
        //console.log(body);
        retData.LoginSuccessful = body.LoginSuccessful;
        retData.Role= body.Role;
        retData.UserInformation = body.UserInformation;

        if(body.LoginSuccessful && body.Role!='registered'){
            /*************************************************************
             *  Now find the participant in the dashboard DB
             ************************************************************/
            db.collection(participantsCollName, function(err, collection) {
                collection.findOne({'Username':un}, function(err, item) {
                    if(err){
                        console.log(err);
                        res.send('error while looking for participant: '+ err);
                        return(next(err));
                    }

                    if(item)
                    {
                        /********************
                         *** Set Session ****
                         ********************/
                        req.session.auth=true;
                        req.session.user=item;
                        req.session.user.WWInfo= retData.UserInformation;
                        req.session.isParticipant = true;

                        retData.ParticipantInfo = item;
                        /******************************************
                         *** Save WW information in pilot db ****
                         ******************************************/
                        console.log('saving WW Info - not username/password');
                        collection.update({_id:item._id}, {$set:{WWInfo:retData.UserInformation}}, {safe:true}, function(err, result) {
                            if (err) {
                                console.log('Error updating ww Info: ' + err);
                                res.send({'error':'An error has occurred'});
                            } else {
                                console.log('' + result + ' document(s) updated');
                                //res.send(result);
                            }
                        });

                        //check if the user took assessment and set that property in the session object
                        db.collection(assessmentCollName, function(err, collection) {
                            //console.log(item);
                            collection.findOne({'Assessment.UserId':item._id}, function(err, assm) {
                                if(err){
                                    console.log(err);
                                    res.send('error while looking for assessment: '+ err);
                                    return(next(err));
                                }

                                if(assm){
                                    console.log('found assessment');
                                    req.session.user.assessment=true;
                                }
                                //console.log(retData);
                                res.send(retData);
                            });
                        });

                    }else
                    {
                        console.log('participant not found');
                        res.render('participantLogin',{'message':'Coaching pilot credentials are not valid. Please try again','username':un});

                    }

                });
            });
        }else{
            res.render('participantLogin',{'message':'These WeightWatchers credentials are not valid. Please try again','username':un});
        }
    });





});
};



/**************************************************************************************************
   This API service is called after the participant has successfully authenticated using the
   WWAuth service.
   ---------------------    SET THE PILOT SESSION VARIABLES          ------------
                                         |
                                         |
                         DOES THE USER EXIST IN THE PILOT DB?
                                        /\
                                       /  \
                                      /    \
                                    YES    NO
                                    /        \
                         DO NOTHING         WAS THE CHECBOX TO SAVE USER/PWD CHECKED?
                                                        /\
                                                       /  \
                                                      /    \
                                                    NO     YES
                                                    /        \
                                              DO NOTHING    SAVE U/P
 **************************************************************************************************/
exports.saveParticipantCreds = function(req, res,next) {helper.getConnection(function(err,db){
    console.log('calling saveParticipantCreds function for PARTICIPANT');
    var user = req.body.username;
    var pwd = req.body.password;
    var saveCred = req.body.saveCred;
    console.log('user: ' + user);
    console.log('password: ' + pwd);
    console.log('saveCred: ' + saveCred);
    db.collection(participantsCollName, function(err, collection) {

        collection.findOne(
            {
                'Username':user,
                'Password':pwd
            }, function(err, item) {
            if(err){
                console.log(err);
                res.send('error while looking for participant : '+ err);
                return(next(err));
            };

            if(item)
            {
                //console.log(item);
                req.session.auth=true;
                req.session.userId=item._id;
                req.session.user=item;

                //If the user has agreed, save credentials
                if(req.body.saveCred){
                    collection.update({_id:item._id},{$set:{username:user,password:pwd}},function(err,result){
                        if(err){
                            res.send('error while updating username/password : '+ err);
                        }else{
                            res.send('error while looking for participant : '+ err);
                        }
                    });
                }
                res.redirect('/participant');
            }else
            {
                console.log('participant not found');
                res.render('index',{'message':'no user found'});

            }

        });
    });

});
};

exports.logout = function(req,res){
    //build the url to redirect to on logout
    var referrer = req.headers['referer'];
    req.session.destroy(function(err){
        if(!err){
            if(referrer) {
                res.redirect(referrer);
            }
            else{
                res.redirect('/coach');
            }

        }
    });
}

exports.checkAuth = function(req,res,next){
    if(req.session && req.session.auth ){
        next();
    }else{
        res.redirect('/admin');
    }
};

exports.checkAdmin = function(req,res,next){
    if(req.session && req.session.auth && req.session.isAdmin){
        next();
    }else{
         res.redirect('/admin');
    }
};

exports.checkCoach = function(req,res,next){
    if(req.session && req.session.auth && req.session.isCoach){
        next();
    }else{
         res.redirect('/');
    }
};

exports.checkParticipant = function(req,res,next){
    if(req.session && req.session.auth && req.session.isParticipant){
        next();
    }else{
        res.redirect('/');
    }
};

function performRequest(endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
    }
    else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }
    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log(responseString);
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    });

    req.write(dataString);
    req.end();
}