//###############################################################
//##### Services related to dasboard admin and coach auth #######
//###############################################################

var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');
var BSON = mongo.BSONPure;

var coachesCollName = 'coaches';

exports.login = function(req, res,next) {helper.getConnection(function(err,db){
    console.log('calling login funcion');
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
                res.send('no user found: '+ err);
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
                    //res.render('admin');
                 }else{
                     console.log(item);
                     //res.render('coach',{coach:item});
                }
                 res.redirect('/');
            }else
            {
                console.log('user not found');
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