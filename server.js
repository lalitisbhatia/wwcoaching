var express = require('express'),
    path = require('path'),
    http = require('http'),
    util = require('util'),
    bodyParser = require('body-parser'),
    api = require('./routes/api'),
    schApi = require('./routes/schedulerApi'),
    home = require("./routes/index"),
    admin = require("./routes/admin"),
    assmnt = require("./routes/assessments"),
    schedule = require("./routes/schedule");

var app = express();

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
app.get('/logout',admin.logout);



// app.get('/coachhome',admin.checkUser,coaches.getCoachInfo);
// app.get('/adminhome',admin.checkAdmin,home.adminhome);

//***********************************************************
//*****This section is for the API routes to get data********
//***********************************************************

app.get('/coaches',admin.checkAdmin,api.getAllCoaches);
app.get('/coaches/:id',admin.checkAdmin,api.getCoachById);
app.get('/coach',admin.checkCoach, api.getCoachInfo);
app.post('/addCoach', admin.checkAdmin,api.addCoach);
app.post('/updateCoach', admin.checkAdmin,api.updateCoach);
app.post('/deleteCoach',admin.checkAdmin, api.deleteCoach);
//*************************************************
//*****This section is for the users data********
//*************************************************
app.get('/users',admin.checkAdmin,api.getAllUsers);
app.get('/users/:id',admin.checkCoach,api.getUserById);
app.get('/cusers',admin.checkCoach, api.getUsersByCoachId);
app.post('/addUser', admin.checkAdmin,api.addUser);
app.post('/updateUser',admin.checkAdmin, api.updateUser);
app.post('/deleteUser',admin.checkAdmin, api.deleteUser);

//****************************************************
//*****This section is for the assessment data********
//***************************************************
app.get('/assessment/:id',assmnt.getAssmById);
app.post('/assessment', assmnt.saveAssm);

//****************************************************
//*****This section is for the schedule data********
//****************************************************
app.get('/getCoachAvails', schApi.getCoachAvails);
app.post('/addCoachAvails', schApi.addCoachAvails);
app.get('/searchAvails/:datetime', schApi.searchAvails);
/****************************************************
  This section is for the call Notes and action plans
/****************************************************/
app.get('/getCallNotes/:userid',admin.checkCoach, api.getCallNotes);
app.post('/addCallNote',admin.checkCoach, api.addCallNote);
app.post('/updateCallNote',admin.checkCoach, api.updateCallNote);
app.post('/deleteCallNote',admin.checkCoach, api.deleteCallNote);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
