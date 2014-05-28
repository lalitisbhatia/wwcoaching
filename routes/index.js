/*
 * GET home page.
 */


exports.home = function(req, res,next){
    console.log('arriving at admin user');
    var fn = req.params.firstname;
    var ln = req.params.lastname;
    if(req.session.auth){
        console.log('user is authorised');

        if(req.session.isAdmin){
            console.log('user is ADMIN');
            console.log('redirecting to admin home');
            res.redirect('/admin');
        }else if(req.session.isCoach){
            console.log('user is COACH');
            res.render('coach');
        }else if(req.session.isParticipant){
            console.log('user is PARTICIPANT');
            res.redirect('/participant/'+fn+'/'+ln);
        }else{
            console.log('defaulting to COACH');
            res.redirect('/coach');
        }
    }else{
        res.redirect('/coach');
    }
};

exports.admin = function(req, res,next){
    console.log('arriving at admin user');
    if(req.session.auth){
        console.log('user is authorised');
        if(req.session.isAdmin){
            console.log('user is ADMIN');
            console.log('redirecting to admin home');
            res.render('admin');    
        }
//        else {
//            console.log('redirecting to coach home');
//            res.render('coach')
//        }
    }else{
        res.render('adminLogin');
    }
};

exports.coach = function(req, res,next){
    if(req.session.auth){
        if(req.session.isCoach){
            res.render('coach');
        }
    }else{
        res.render('coachLogin');
    }
};

exports.participant = function(req, res,next){
    var fn = req.params.firstname;
    var ln = req.params.lastname;
    console.log(fn + ' - '+ ln);
    console.log('inside index.js router');
    //console.log(req.session.user);

    /****************************************
      Participant routing:
        if not auth,
            login page
        Else
            if not assessment taken
                go to assm page
            else
                go to scheduling page
     ***************************************/
    if(req.session.auth){
        if(req.session.isParticipant){
            if (req.session.user.assessment){
                if(req.session.user.CoachId) {//if a user has a coach associated, then the view is different than the first time scheduling
                    console.log('user has coach associated');
                    res.render('participantSubs', {user: req.session.user});
                }else{
                    console.log('user does not have coach associated yet');
                    res.render('participantFirst', {user: req.session.user});
                }
            }else{
                res.render('assessment',{user:req.session.user});
            }
        }
    }else{
        res.render('participantLogin',{firstname:fn,lastname:ln});
    }
};


