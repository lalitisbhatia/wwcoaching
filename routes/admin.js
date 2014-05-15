//###############################################################################
//##### Services related to dasboard admin and coach and participant auth #######
//###############################################################################

var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;

var coachesCollName = 'coaches';
var participantsCollName = 'users';

exports.login = function(req, res,next) {helper.getConnection(function(err,db){
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
                    req.session.auth=true;
                    req.session.userId=item._id;
                    req.session.user=item;

                    if(item.admin){
                        req.session.admin=true;
                    }else{
                        console.log(item);
                    }
                    res.redirect('/');
                }else
                {
                    console.log('coach not found');
                    res.render('index',{'message':'no coach found'});

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
                    req.session.auth=true;
                    req.session.userId=item._id;
                    req.session.user=item;

                    if(item.admin){
                        req.session.admin=true;
                    }else{
                        console.log(item);
                    }
                    res.redirect('/');
                }else
                {
                    console.log('coach not found');
                    res.render('index',{'message':'no coach found'});

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
    req.session.destroy(function(err){
        if(!err){
            res.redirect('/');
        }
    });
}

exports.checkAdmin = function(req,res,next){
    if(req.session && req.session.auth && req.session.admin){
        next();
    }else{
         res.redirect('/');
    }
}

exports.checkUser = function(req,res,next){
    if(req.session && req.session.auth ){
        next();
    }else{
         res.redirect('/');
    }
}