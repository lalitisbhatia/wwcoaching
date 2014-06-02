var express = require('express'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    util = require('util'),
    bodyParser = require('body-parser'),
    api = require('./routes/api'),
    schApi = require('./routes/schedulerApi'),
    home = require("./routes/index"),
    admin = require("./routes/admin"),
    assmnt = require("./routes/assessments"),
    schedule = require("./routes/schedule");
    mailer = require("./routes/mailer");

var app = express();

var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();
var options = {
    key: privateKey,
    cert: certificate
};
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.cookieParser('random secret passphrase'));
    app.use(express.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});


/********************************************************************************************************/

//*************************************************
//**************Handle UI routes ******************
//*************************************************

app.get('/',home.home);
app.get('/admin',home.admin);
app.get('/coach',home.coach);
app.get('/participant/:firstname/:lastname',home.participant);


app.get('/getuser/:id',function(req,res){
    res.render('user');
});
app.get('/getcoach/:id',function(req,res){
    res.render('coach');
});
app.get('/getassessment/:id',function(req,res){
    res.render('assessment');
});
app.get('/getschedule/',function(req,res){
    res.render('schedule');
});

app.post('/admin',admin.loginAdmin);
app.post('/coach',admin.loginCoach);
app.post('/participant',admin.loginParticipant);
app.post('/registerParticipant',api.addUser); //adding user by admin and self registration by users is handled by api.addUser
app.get('/logout',admin.logout);



// app.get('/coachhome',admin.checkUser,coaches.getCoachInfo);
// app.get('/adminhome',admin.checkAdmin,home.adminhome);

//***********************************************************
//*****This section is for the API routes to get data********
//***********************************************************

app.get('/coaches',admin.checkAuth,api.getAllCoaches);
app.get('/coaches/:id',admin.checkAuth,api.getCoachById);
app.get('/coachinfo',admin.checkCoach, api.getCoachInfo);
app.post('/addCoach', admin.checkAdmin,api.addCoach);
app.post('/updateCoach', admin.checkAdmin,api.updateCoach);
app.post('/deleteCoach',admin.checkAdmin, api.deleteCoach);
//*************************************************
//*****This section is for the users data********
//*************************************************
app.get('/users',admin.checkAdmin,api.getAllUsers);
app.get('/users/:id',admin.checkAuth,api.getUserById);
app.get('/cusers',admin.checkCoach, api.getUsersByCoachId);
app.post('/addUser', admin.checkAdmin,api.addUser);
app.post('/updateUser',admin.checkAdmin, api.updateUser);
app.post('/deleteUser',admin.checkAdmin, api.deleteUser);

//****************************************************
//*****This section is for the assessment data********
//***************************************************
//app.get('/assessment*',admin.checkParticipant,home.participant);

app.get('/assessment/:id',assmnt.getAssmByUserId);
app.get('/getuser/:id/assmResults',assmnt.getAssmByUserId);
app.post('/participant/:firstname/:lastname',admin.checkParticipant, assmnt.saveAssm);

//****************************************************
//*****This section is for the schedule data********
//****************************************************
app.get('/getCoachAvails', schApi.getCoachAvails);
app.post('/addCoachAvails', schApi.addCoachAvails);
app.get('/searchAvails/:type/:value', schApi.searchAvails);
app.get('/searchAppts/user/:id', schApi.searchUserAppts);
app.get('/searchCoachAppts/coach/:id', schApi.searchCoachAppts);
app.post('/saveAppt', schApi.saveUserAppt);
app.post('/cancelAppt', schApi.cancelUserAppt);
/****************************************************
  This section is for the call Notes and action plans
/****************************************************/
app.get('/getCallNotes/:userid',admin.checkCoach, api.getCallNotes);
app.post('/addCallNote',admin.checkCoach, api.addCallNote);
app.post('/updateCallNote',admin.checkCoach, api.updateCallNote);
app.post('/deleteCallNote',admin.checkCoach, api.deleteCallNote);

app.post('/email',mailer.sendMail);
app.post('/emailActionPlan',mailer.emailActionPlan);

/****************************************************
 This section is for the emailing
 /****************************************************/


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
