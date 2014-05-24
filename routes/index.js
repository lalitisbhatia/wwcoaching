/*
 * GET home page.
 */

var coaches = require('../routes/coaches');

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
    console.log(req.session.user);
    if(req.session.auth){
        if(req.session.isParticipant){
            res.render('participant');
        }
    }else{
        res.render('participantLogin',{firstname:fn,lastname:ln});
    }
};

exports.assessment = function(req, res,next){
    //var fn = req.params.firstname;
    //var ln = req.params.lastname;
    console.log('inside router');
//    if(req.session.auth){
//        if(req.session.isParticipant){
    //res.render('assessment',{firstname:fn,lastname:ln});
    res.redirect('asm.html');
//        }
//    }else{
//        res.redirect('/');
//    }

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
