var mongo = require("mongodb");
var helper = require('../public/lib/dbhelper');

var nodemailer = require("nodemailer");


exports.sendMail = function(req,res){
    console.log('inside coach mailing program - printing req.body');
    //console.log(req.body);
    //var coachId = req.body.EmailOptions;
    var date = new Date(req.body.Date);

    var display_date = date.getDay()+', '+date.getMonth()+' '+date.getDate();
    var participantEmail = req.body.EmailOptions.userEmail;
    var coachEmail = req.body.EmailOptions.coachEmail;
    var subj= req.body.EmailOptions.subject;
    var participantMsg = req.body.EmailOptions.userMsg;
    var coachMsg = req.body.EmailOptions.coachMsg;
    var coachId = req.body.EmailOptions.coachId;


    helper.getConnection(function(err,db){
        db.collection('coaches', function(err, collection) {
            collection.findOne({'_id':coachId}, function(err, coach) {
                if(err){
                    console.log('error retreiving coach info before sending email: '+ err);
                }else{ //now send email

                    //console.log("subj: "+subj);
                    //console.log("msgCoach: "+coachMsg);
                    //console.log("msgParticipant: "+participantMsg);


                    var smtpTransport = nodemailer.createTransport("SMTP",{
                        host: "outlook.office365.com", // hostname
                        secureConnection: false, // TLS requires secureConnection to be false
                        port: 587, // port for secure SMTP,
                        auth: {
                            user: coachEmail,
                            pass: coach.EmailPassword
                        },
                        tls: {
                            ciphers:'SSLv3'
                        }
                    });

                    var mailOptions = createMailOptions(subj,coachEmail,coachEmail,coachMsg);

                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            console.log(error);
                        }else{
                            console.log("Message sent to coach: " + response);
                            console.log('Sending message to participant');
                            //now send email to participant

                            mailOptions = createMailOptions(subj,participantEmail,coachEmail,participantMsg);
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

exports.emailActionPlan = function(req,res){
    console.log(req.body);
    var coachId=req.body.coachId;
    var subj=req.body.Subj;
    var msg=req.body.Message;
    var userEmail= req.body.userEmail;
    var coachEmail = req.body.coachEmail;

    helper.getConnection(function(err,db){
        db.collection('coaches', function(err, collection) {
            collection.findOne({'_id':coachId}, function(err, coach) {
                if(err){
                    console.log('error retreiving coach info before sending email: '+ err);
                }else{ //now send email

                    //console.log("subj: "+subj);
                    //console.log("msgCoach: "+coachMsg);
                    //console.log("msgParticipant: "+participantMsg);


                    var smtpTransport = nodemailer.createTransport("SMTP",{
                        host: "outlook.office365.com", // hostname
                        secureConnection: false, // TLS requires secureConnection to be false
                        port: 587, // port for secure SMTP,
                        auth: {
                            user: coachEmail,
                            pass: coach.EmailPassword
                        },
                        tls: {
                            ciphers:'SSLv3'
                        }
                    });

                    var mailOptions = createMailOptions(subj,userEmail,coachEmail,msg);

                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            console.log(error);
                        }else{
                            console.log("Message sent to user: " + response);
                            console.log('Sending message to participant');
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
        html:message,
        from:emailFrom // sender address
    };
    return mailOptions;
}


