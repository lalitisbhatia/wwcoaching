/*
 * GET home page.
 */

var coaches = require('../routes/coaches');


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
    if(req.session.auth){
        if(req.session.isParticipant){
            res.render('participant');
        }
    }else{
        res.render('participantLogin');
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
