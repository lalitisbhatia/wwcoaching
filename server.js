var express = require('express'),
    path = require('path'),
    http = require('http'),
    bodyParser = require('body-parser'),
    coaches = require('./routes/coaches'),
    users = require('./routes/users'),
    home = require("./routes/index"),
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
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    //app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});



app.get('/',home.index);

//*************************************************
//*****This section is for the coaches data********
//*************************************************
//  app.get('/CoachDashboard.html',function(req,res){
//      res.render('CoachDashboard.html');
//  });
app.get('/coaches',coaches.getAllCoaches);
app.get('/coaches/:id',coaches.getCoachById);
app.post('/coaches', coaches.addCoach);
app.put('/coaches/:id', coaches.updateCoach);

//*************************************************
//*****This section is for the users data********
//*************************************************
app.get('/users',users.getAllUsers);
app.get('/users/:id',users.getUserById);
app.get('/cusers/:cid',users.getUserByCoachId);
app.post('/users', users.addUser);
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

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
