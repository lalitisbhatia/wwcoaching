var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');

var nodemailer = require("nodemailer");


exports.sendMail = function(req,res){
    console.log('inside coach mailing program');
    var coachId = req.body.CoachId;
    var date = new Date(req.body.Date);
    var user = req.session.user;
    var display_date = date.getDay()+', '+date.getMonth()+' '+date.getDate();

    var participantEmail = user.Email;
    var participantName = user.FirstName;


    helper.getConnection(function(err,db){
        db.collection('coaches', function(err, collection) {
            collection.findOne({'_id':coachId}, function(err, coach) {
                if(err){
                    console.log('error retreiving coach info before sending email: '+ err);
                }else{ //now send email
                    var coachEmail = coach.Email;
                    var coachName = coach.FirstName + " "+coach.LastName;
                    var coachMessage="Hi "+coachName +',\n ' + participantName + ' has booked a call with you  for '+date;

                    //console.log(coach);
                    //console.log(coachMessage);


                    var smtpTransport = nodemailer.createTransport("SMTP",{
                        host: "outlook.office365.com", // hostname
                        secureConnection: false, // TLS requires secureConnection to be false
                        port: 587, // port for secure SMTP,
                        auth: {
                            user: coach.Email,
                            pass: coach.EmailPassword
                        },
                        tls: {
                            ciphers:'SSLv3'
                        }
                    });
                    var mailOptions = {
                        subject: "Coaching session is booked",
                        to: coach.Email,
                        text : coachMessage,
                        from:coach.Email // sender address
                    };


                    console.log(smtpTransport);
                    console.log(mailOptions);

                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent to coach: " + response);
                        console.log('Sending message to participant');
                        //now send email to participant
                        var participantMessage = "Hi "+ participantName +",\n You have booked a call with "+coachName + ' for '+date;
                        mailOptions = {
                            subject: "Your Coaching session is booked",
                            to: participantEmail,
                            text : participantMessage,
                            from:coach.Email // sender address
                        };
                        smtpTransport.sendMail(mailOptions, function(error, response){
                            if(error){
                                console.log('error sending email to participant:' + error);
                            }else{
                                console.log("Message sent to participant: " + response);
                                res.send('success');
                            }
                        });
                        //smtpTransport.close(); // shut down the connection pool, no more messages
                    }

                });
                }
            });
        });

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
            //smtpTransport.close(); // shut down the connection pool, no more messages
        }
    });
};
