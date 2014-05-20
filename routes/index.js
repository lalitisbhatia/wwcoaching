/*
 * GET home page.
 */

var coaches = require('../routes/coaches');

exports.home = function(req, res,next){
    console.log('arriving at admin user');
    if(req.session.auth){
        console.log('user is authorised');

        if(req.session.isAdmin){
            console.log('user is ADMIN');
            console.log('redirecting to admin home');
            res.render('admin');
        }else if(req.session.isCoach){
            console.log('user is COACH');
            res.render('coach');
        }else if(req.session.isParticipant){
            console.log('user is PARTICIPANT');
            res.render('participant');
        }else{
            console.log('defaulting to COACH');
            res.render('coach');
        }
//        else {
//            console.log('redirecting to coach home');
//            res.render('coach')
//        }
    }else{
        res.render('adminLogin');
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
    if(req.session.auth){
        if(req.session.isParticipant){
            res.render('participant');
        }
    }else{
        res.render('participantLogin',{firstname:fn,lastname:ln});
    }
};


exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

// exports.adminhome = function(req,res){
//     console.log('rendering coach home');
//     res.render('admin'); 
// };

// exports.coachhome = function(req,res){
//     res.render('coach'); 
// };
