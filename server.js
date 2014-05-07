var express = require('express'),
    path = require('path'),
    http = require('http'),
    util = require('util'),
    bodyParser = require('body-parser'),
    coaches = require('./routes/coaches'),
    users = require('./routes/users'),
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






//*************************************************
//**************Handle UI routes ******************
//*************************************************

app.get('/',home.index);
app.get('/getuser/:id',function(req,res){
    res.render('user');
})
app.post('/',admin.login);
app.get('/logout',admin.logout);

// app.get('/coachhome',admin.checkUser,coaches.getCoachInfo);
// app.get('/adminhome',admin.checkAdmin,home.adminhome);

//***********************************************************
//*****This section is for the API routes to get data********
//***********************************************************

app.get('/coaches',admin.checkAdmin,coaches.getAllCoaches);
app.get('/coaches/:id',coaches.getCoachById);
app.get('/coach',admin.checkUser, coaches.getCoachInfo);
app.post('/coaches', coaches.addCoach);
app.put('/coaches/:id', coaches.updateCoach);

//*************************************************
//*****This section is for the users data********
//*************************************************
app.get('/users',admin.checkAdmin,users.getAllUsers);
app.get('/users/:id',admin.checkUser,users.getUserById);
app.get('/cusers',admin.checkUser, users.getUsersByCoachId);
app.put('/users/:id', users.updateUser);



//****************************************************
//*****This section is for the assessment data********
//***************************************************
app.get('/assm/:id',assmnt.getAssmById);
app.post('/assm', assmnt.saveAssm);

//****************************************************
//*****This section is for the schedule data********
//****************************************************
app.get('/schedule', schedule.getCoachAvails);
//app.get('*',home.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
