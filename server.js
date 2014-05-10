var express = require('express'),
    path = require('path'),
    http = require('http'),
    util = require('util'),
    bodyParser = require('body-parser'),
    api = require('./routes/api'),
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

app.get('/',home.index);
app.get('/getuser/:id',function(req,res){
    res.render('user');
})
app.get('/getcoach/:id',function(req,res){
    res.render('coach');
})
app.get('/getassessment/:id',function(req,res){
    res.render('assessment');
})
app.get('/getschedule/',function(req,res){
    res.render('schedule');
})

app.post('/',admin.login);
app.get('/logout',admin.logout);

// app.get('/coachhome',admin.checkUser,coaches.getCoachInfo);
// app.get('/adminhome',admin.checkAdmin,home.adminhome);

//***********************************************************
//*****This section is for the API routes to get data********
//***********************************************************

app.get('/coaches',admin.checkAdmin,api.getAllCoaches);
app.get('/coaches/:id',api.getCoachById);
app.get('/coach',admin.checkUser, api.getCoachInfo);
app.post('/coaches', api.addCoach);
app.put('/coaches/:id', api.updateCoach);

//*************************************************
//*****This section is for the users data********
//*************************************************
app.get('/users',admin.checkAdmin,api.getAllUsers);
app.get('/users/:id',admin.checkUser,api.getUserById);
app.get('/cusers',admin.checkUser, api.getUsersByCoachId);
app.put('/users/:id', api.updateUser);



//****************************************************
//*****This section is for the assessment data********
//***************************************************
app.get('/assessment/:id',assmnt.getAssmById);
app.post('/assessment', assmnt.saveAssm);

//****************************************************
//*****This section is for the schedule data********
//****************************************************
app.get('/schedule', api.getCoachAvails);

/****************************************************
  This section is for the call Notes and action plans
/****************************************************/
app.get('/getCallNotes/:userid',admin.checkUser, api.getCallNotes);
app.post('/addCallNote',admin.checkUser, api.addCallNote);
app.post('/updateCallNote',admin.checkUser, api.updateCallNote);



http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
