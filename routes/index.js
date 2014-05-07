/*
 * GET home page.
 */

var coaches = require('../routes/coaches');

exports.index = function(req, res,next){
    
    if(req.session.auth){
        if(req.session.admin){
            res.render('admin');    
           // next();
        }else {
            console.log('redirecting to coach home');
            res.render('coach')
            //next();
        }
    }else{
        res.render('index');
        //next();
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
