//###############################################################################
//##### Services related to dasboard admin and coach and participant auth #######
//###############################################################################

var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;


var coachesCollName = 'coaches';
var participantsCollName = 'users';

exports.loginAdmin = function(req, res,next) {helper.getConnection(function(err,db){
    console.log('calling login function for ADMIN');
    console.log('user: ' + req.body.username);
    console.log('password: ' + req.body.password);
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
                    console.log(item);
                    if(item.admin){
                        req.session.auth=true;
                        req.session.userId=item._id;
                        req.session.user=item;
                        req.session.isAdmin=true;
                        console.log(item);
                    }else{

                        console.log(item);
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
    console.log('user: ' + req.body.username);
    console.log('password: ' + req.body.password);
    db.collection(coachesCollName, function(err, collection) {
        collection.findOne(
            {
                'Username':req.body.username,
                'Password':req.body.password
            }, function(err, item) {
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
                    console.log(item);
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
    console.log('logging request object');
    //console.log(req);
    var fn = req.body.firstname;
    var ln = req.body.lastname;
    console.log(fn + ' - ' + ln);




    db.collection(participantsCollName, function(err, collection) {
        collection.findOne(
            {
                'FirstName':fn,
                'LastName':ln
            }, function(err, item) {
                if(err){
                    console.log(err);
                    res.send('error while looking for participant: '+ err);
                    return(next(err));
                }

                if(item)
                {
                    //console.log(item);
                    req.session.auth=true;
                    req.session.userId=item._id;
                    req.session.user=item;
                    req.session.isParticipant = true;
                    //if the checkbox was checked, save the ww credentials to pilot db
                    //console.log(item);
                    res.redirect('/participant/'+fn+'/'+ln);
                }else
                {
                    console.log('participant not found');
                    res.render('participantLogin',{'message':'Coaching pilot credentials are not valid. Please try again'});

                }

            });
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
    if(req.session && req.session.auth ){
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