var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');

var nodemailer = require("nodemailer");


exports.sendMail = function(req,res){
    console.log('inside coach mailing program - printing req.body');
    console.log(req.body);
    var coachId = req.body.Coach;
    var date = new Date(req.body.Date);
    var user = req.session.user;
    var display_date = date.getDay()+', '+date.getMonth()+' '+date.getDate();
    var participantEmail = user.Email;
    var participantName = user.FirstName + ' ' + user.LastName;
    var type = req.body.emailType;

    //email options variables
    var subj;
    var msgCoach;
    var msgParticipant;



    helper.getConnection(function(err,db){
        db.collection('coaches', function(err, collection) {
            collection.findOne({'_id':coachId}, function(err, coach) {
                if(err){
                    console.log('error retreiving coach info before sending email: '+ err);
                }else{ //now send email
                    var coachEmail = coach.Email;
                    var coachName = coach.FirstName + " "+coach.LastName;

                    if(type=='new'){
                        subj="Coaching session booked";
                        msgCoach="Hi "+coachName +",\n "+ participantName +" has booked a call with you  for " +date;
                        msgParticipant="Hi "+participantName + " ,\n You have booked a call with " +coachName+" for " +date;
                    }else if(type=='cancel'){
                        subj="Coaching session cancelled";
                        msgCoach="Hi " + coachName+ " ,\n Your coaching session with "+participantName+ " for "+date+" has been cancelled.";
                        msgParticipant="Hi "+ participantName +",\n Your coaching session with " + coachName + "for " + date +" has been cancelled.";
                    }

                    console.log("subj: "+subj);
                    console.log("msgCoach: "+msgCoach);
                    console.log("msgParticipant: "+msgParticipant);


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

                    var mailOptions = createMailOptions(subj,coachEmail,coachEmail,msgCoach);

                    //console.log(smtpTransport);
                    //console.log(mailOptions);

                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            console.log(error);
                        }else{
                            console.log("Message sent to coach: " + response);
                            console.log('Sending message to participant');
                            //now send email to participant

                            mailOptions = createMailOptions(subj,participantEmail,coachEmail,msgParticipant);
                            //console.log(mailOptions);
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

function createMailOptions(subject,emailTo,emailFrom,message){
    var mailOptions={};

    mailOptions = {
        subject: subject,
        to: emailTo,
        text : message,
        from:emailFrom // sender address
    };
    return mailOptions;
}


