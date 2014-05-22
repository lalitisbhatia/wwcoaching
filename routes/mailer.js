var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "outlook.office365.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: "lalit.Bhatia@weightwatchers.com",
        pass: "NewZealand0100"
    },
    tls: {
        ciphers:'SSLv3'
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "WWCoaching   <lalit.bhatia@weightwatchers.com>", // sender address
    //to: "lalit.bhatia@weightwatchers.com", // list of receivers
    subject: "Message from dashboard :)"

};

// send mail with defined transport object
exports.sendMail = function(req,res){
    sendCoachMail(req,res);
    sendParticipantMail(req,res);
};


var sendCoachMail = function(req,res){
    console.log('inside coach mailing program');
    var coach = req.body.Coach;
    var date = new Date(req.body.Date);
    var display_date = date.getDay()+', '+date.getMonth()+' '+date.getDate();

    var coachEmail = coach.coachEmail;
    var coachName = coach.coachName;
    var participantName = req.session.user.FirstName + ' '+ req.session.user.LastName;

    var coachMessage="Hi "+coachName +',\n ' + participantName + ' has booked a call with you  for '+date;

    console.log(coach);
    console.log(coachMessage);

    mailOptions.to = coachEmail;
    mailOptions.text = coachMessage;

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent to coach: " + response.message);
            smtpTransport.close(); // shut down the connection pool, no more messages
        }

    });
};

var sendParticipantMail = function(req,res){


    console.log('inside participant mailing program');
    var coach = req.body.Coach;
    var coachName = coach.coachName;
    var user = req.session.user;
    var date = new Date(req.body.Date);
    var display_date = date.getDay()+', '+date.getMonth()+' '+date.getDate();

    var participantEmail = user.Email;
    var participantName = user.FirstName;

    var participantMessage = "Hi "+ participantName +",\n You have booked a call with "+coachName + ' for '+date;

    console.log(participantMessage);

    mailOptions.to = participantEmail;
    mailOptions.text = participantMessage;
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else {
            console.log("Message sent to participant: " + response.message);
            smtpTransport.close(); // shut down the connection pool, no more messages
        }
    });
};
