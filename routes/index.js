/*
 * GET home page.
 */


exports.index = function(req, res,next){
    
    if(req.session.auth){
        if(req.session.admin){
            res.redirect('/coaches');    
           // next();
        }else {
            console.log('redirecting to coach home');
            res.render('coach');
            //next();
        }
    }else{
        res.render('index');
        //next();
    }
};

// exports.adminhome = function(req,res){
//     console.log('rendering coach home');
//     res.render('admin'); 
// };

// exports.coachhome = function(req,res){
//     res.render('coach'); 
// };
