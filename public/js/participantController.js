participantModule.controller('ParticipantLoginController', ['$scope','$http','$routeParams','$log','participantService','schedulingService', function($scope,$http,$routeParams,$log,participantService,schedulingService) {
    $scope.initApp=function(un){
        $log.log('participantController initialized');

        $scope.username=un;
        //var ln = $('#lastname').val();
        //var fn = $('#firstname').val();
        //var un = $('#un').val();
        //console.log(fn + ' ' + ln + ' ' + $scope.username);

        $scope.password='';
        $scope.wwProfile='';
        //$scope.firstname=fn;
        //$scope.lastname=ln;
        $scope.errMessage='';
        $scope.participantId="";
        $scope.saveWWCreds=true;
        $scope.newuser={};
    };

    /*****************************************************
    *** Method to register user to the pilot portal
     ******************************************************/
    $scope.saveuser = function() {
        console.log($scope.username);
        $scope.newuser.Username= $scope.username;
        $scope.valid=true;
        $scope.validateForm();
        console.log('valid = ' + $scope.valid);
        console.log($scope.newuser);
        if($scope.valid) {
            participantService.addNewUser($scope.newuser).then(function (data) {
                console.log('logging return from add user');
                console.log(data);
                window.location.reload(true);
            });
        }

    };

    $scope.validateForm = function(){
        if(!$scope.newuser.Email){
            console.log('email empty');
            $scope.errorEmail='please enter your email';
            $scope.valid=false;
        }else{
            $scope.errorEmail='';
        }
        if(!$scope.newuser.Phone){
            $scope.errorPhone='please enter your phone number';
            $scope.valid=false;
        }else{
            $scope.errorPhone='';
        }
    };

    $scope.getWWDetails = function(){
        //console.log('Credentials: ' + $scope.username + ' - ' + $scope.password);
        var loginInfo = { "U": $scope.username, "P": $scope.password, "R": "true" };
        //console.log(loginInfo);

        participantService.getUserProfile(loginInfo,$scope.username).then(function(data){
            if(data.LoginSuccessful){
                $scope.wwProfile = data.ParticipantInfo.WWInfo;
                $scope.pilotUser= data.ParticipantInfo;
                //console.log(data.ParticipantInfo);
                window.location.replace("/participant/"+$scope.username);
            }else{
                $scope.errMessage="Failed to validate WW credentials. Please try again. "
                $('#lblMsg').attr('style','font-size:11px;font-weight:300;display:inline');
            }

        });


//        $.ajax({
//            url: 'https://mobile.weightwatchers.com/authservice.svc/login',
//            type: "POST",
//            data: JSON.stringify(loginInfo),
//            xhrFields: {
//                withCredentials: true
//            },
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            processData: false,
//            success: function (data, status, xhr) {
//                var row = "";
//                console.log('login successful');
//                console.log(data.LoginSuccessful);
//                //console.log(JSON.stringify(data.LoginSuccessful));
//                if (JSON.stringify(data.LoginSuccessful) == 'true') {
//                    console.log('login successful');
//                } else {
//
//                }
//            },
//            error: function (xhr) {
//                console.log('Error occurred: ' + xhr);
//            }
//
//        });


    };

}]);


participantModule.controller('ParticipantSchController', ['$scope','$http','$routeParams','$log','$timeout','participantService','schedulingService', function($scope,$http,$routeParams,$log,$timeout,participantService,schedulingService) {
    $scope.initSchPage=function(coachId,userId) {
        $log.log('initialized initSchPage');

        //console.log('coachId: '+coachId);
        console.log('userId: '+ userId);

        $scope.EmailOptions={};
        $scope.coaches=[];
           participantService.getAllCoaches().then(function(data){
            $scope.coaches = data;
//            console.log($scope.coaches);
        });

        //get user's coach information
        $scope.coach={};
        //if this is the first time, the user does not have a coach so coachId is undefined
        if(coachId) {
            participantService.getCoachInfo(coachId).then(function (data) {
                $scope.coach = data;
                $scope.coachName = $scope.coach.FirstName + ' ' + $scope.coach.LastName;
            });
        }

        //get user information
        $scope.user={};
        participantService.getUserInfo(userId).then(function(data){
            $scope.user= data;
            $scope.userName= $scope.user.FirstName + ' '+$scope.user.LastName;
            //console.log($scope.user);
        });

        // get availability for the user's coach by default on page load
        if(coachId){
            //console.log('getting availabilities for coach '+coachId);
            schedulingService.getCoachesById(coachId).then(function(data){
                $scope.setSearchResultsCoach(data);
            });
        }
        //get the user's upcoming appointments
        schedulingService.getUserAppts(userId).then(function(data){
            //console.log('getting user appts');
            $scope.setUserAppts(data);
            //console.log(data);
        });

        jQuery('#schButton').click(function(){
            jQuery('#datepicker').datetimepicker('show'); //support hide,show and destroy command
        });
        $('#datepicker').datetimepicker({
            format:'d-M-Y H:i',
            formatTime:"h:i A",
            //inline:true,
            lang:'en',
            //hours24:true,
            //minTime:'09:00',
            //maxTime:'20:00',
            allowTimes:[
                '09:00 AM','09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM','01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
                '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM','05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM','07:30 PM','08:00 PM',
                '08:30 PM', '09:00 PM', '09:30 PM','10:00 PM'
            ],
            step:30
            ,
            onSelectTime:function(dp,$input){
                $log.log('date selected');
                var dateString = $('#datepicker').val();
                console.log('dateString  = ' + dateString );
                var dt  = dateString.split(/\-|\s/)
                var date = new Date(dt.slice(0,3).reverse().join('/')+' '+dt[3]);
                var dateSafari = new Date(dateString);//a hack to make it work in safari
                var dateUTC;
                var currDate=new Date();
                if(date!='Invalid Date') {
                    console.log('valid');
                    dateUTC = new Date(date);
                }else{
                    console.log('not valid');
                    dateUTC = new Date(dateSafari);
                }
                console.log('date  = ' + date );
                console.log('date1  = ' + dateSafari );

                console.log('dateUTC from search = ' + dateUTC );
                console.log('Current date  = ' + new Date() );

                $('#datepicker').attr('css','style=display:none;')
                //$scope.SelectedDate = date.dateFormat('d-M-y, h:i A');

                console.log('$scope.SelectedDateUTC = ' + $scope.SelectedDateUTC);

                //clear out previous messages
                $scope.SearchMessage='';
                $('#SaveApptMsg').attr('style','display:none;');
                $('#continue').attr('style','display:none;');

                $('#fakeSave').click();
                $scope.SelectedDateUTC =dateUTC;
                //Call the service to return results
                $scope.SearchMessage1="";
                $scope.SearchMessage2='';
                $scope.SearchMessage3='';
                schedulingService.getCoachesByDate(dateUTC,currDate).then(function(data){
                    $scope.setSearchResults(data,dateUTC);
                });


            }
        });
    };

    $scope.custom = true;
    $('#coachselect').change(function(){
        var coachId = $(this).children("option:selected").val();
        var coachName = $(this).children("option:selected").text();
        console.log(coachName  + ' selected');

        //clear out previous messages
        $scope.SearchMessage='';
        $('#SaveApptMsg').attr('style','display:none;');
        $('#continue').attr('style','display:none;');

        //search for coaches using coachId
        if(coachId) {
            schedulingService.getCoachesById(coachId).then(function (data) {
                $scope.setSearchResultsCoachDD(data, coachName);
            });
        }
    });



    //this is for the participantFirst view
    $scope.setSearchResults = function(data,dateUTC){
        $scope.availDates = data;
        if($scope.availDates.length>0){
            $scope.SearchMessage = "Coaches available on or around " + dateUTC.dateFormat('M-d, h:iA') ;
        }else{
            $scope.SearchMessage = "No coaches are available on or around " + dateUTC.dateFormat('M-d, h:iA') + ".\n Please search using a different date or search by coach name.";
        }

    };

    $scope.setSearchResultsCoachDD = function(data,coachName){
        $scope.availDates = data;
        if($scope.availDates.length>0){
            $scope.SearchMessage = coachName + " is available at the following times" ;
        }else{
            $scope.SearchMessage = coachName + " is not available at this time. Please check back later";
        }

    };

    //default availability of users's coach
    $scope.setSearchResultsCoach = function(data){
        //console.log('inside setSearchResultsCoach ');
        $scope.coachAvailDates = data;
    };

    //set user's upcoming appointments
    $scope.setUserAppts = function(data){
        //console.log('inside setSearchResultsCoach ');
        $scope.userAppts = data;
    };

    $scope.goToScheduler = function(){
        window.location.replace(window.location.pathname);
        //window.location.reload(true);
    };
    $scope.saveConf=function(coach,date){
        var dt= new Date(date);
        console.log(coach);
        console.log(dt);
        $.confirm({
            title:'<b>It’s almost time… </b>',

            text: "<h3>Please confirm your session:</h3> <br> \n" +
                "   Coach: "+ coach.coachName +"<br> \n " +
                "   Date: " + dt.dateFormat('M-d, h:ia'),
            confirm: function(button) {
                $scope.saveUserAppt(coach,date);
                //alert('confirming');

            },
            cancel: function(button) {
            },
            confirmButton: "Confirm",
            cancelButton: "Cancel"
        });
    };
    $scope.saveUserAppt = function(coach,selDate) {
        console.log('calling save Appt');
        var selectedDate = new Date(selDate);
        var msgCoach="Hi "+coach.coachName +",\n "+ $scope.userName +" has booked a call with you for " +selectedDate.dateFormat('D, M-d, h:iA T');
        var msgUser="Hi "+$scope.user.FirstName + " ,\n Your coaching call with " +coach.coachName+" is scheduled for " +selectedDate.dateFormat('D, M d,h:iA T')+'. Have a great session';
        var userSubj='Your Coaching session is booked';
        var coachSubj='You have a NEW coaching session!';
        $scope.setEmailOptions(coach.coachId,coach.coachEmail,userSubj,coachSubj,msgUser,msgCoach);
        console.log($scope.EmailOptions);

        console.log(selectedDate);

        //console.log(coach);
//        console.log($scope.coach);
        var appt = {Date:selDate,Coach:coach};
        //console.log(appt);

        schedulingService.saveAppt(appt).then(function(data){
            $scope.userAppts=data;

            $scope.availDates={};
            //$scope.coachAvailDates={};
            $scope.SearchMessage ="";


            $('#continue').attr('style','display:inline;');
            $('#SaveApptMsg').attr('style','display:inline;color:green;');
            //$scope.SaveApptMessage2='Coach: '+coach.coachName;
            //$scope.SaveApptMessage3='Date/time: '+selectedDate.dateFormat('D, M-d, h:iA T');


            //alert($scope.confirmMessage + '\n'+$scope.confirmCoach+'\n'+$scope.confirmDate);
            //$scope.SearchMessage= ($scope.confirmMessage + '\n'+$scope.confirmCoach+'\n'+$scope.confirmDate);
            //trigger emails/text
            schedulingService.sendSchEmails({Date:selectedDate,EmailOptions:$scope.EmailOptions}).then(function(data){
                console.log('success');
            });
            //window.location.reload(true);

        });
    };

    $scope.cancelConf=function(coach,date){
        var dt= new Date(date);
        console.log(coach);
        $.confirm({
            title:'Are you sure you want to cancel this call?',

            text: "   Coach: "+ coach.coachName +"<br> \n " +
                  "   Date: " + dt.dateFormat('M-d, h:ia'),
            confirm: function(button) {
                $scope.cancelUserAppt(coach,date);
                //alert('confirming');
            },
            cancel: function(button) {
            },
            confirmButton: "Yes",
            cancelButton: "No"
        });
    };
    $scope.cancelUserAppt = function(coach,selDate) {
        console.log('calling cancel Appt');
        var selectedDate = new Date(selDate);
        var msgCoach="Hi "+$scope.coachName +",\n "+ $scope.userName +" has cancelled a call with you  for " +selectedDate.dateFormat('D, M-d, h:iA T');
        var msgUser="Hi "+$scope.userName + " ,\n You have cancelled a call with " +$scope.coachName+" for " +selectedDate.dateFormat('D, M-d, h:iA T');
        var subj='Coaching session cancelled';
        $scope.setEmailOptions(coach.coachId,coach.coachEmail,subj,subj,msgUser,msgCoach);
        console.log($scope.EmailOptions);
        //console.log(selectedDate);
        //console.log(coach);

        var appt = {Date:selDate,Coach:coach};
        console.log(appt);
        schedulingService.cancelAppt(appt).then(function(data){
            $scope.userAppts=data;
            $scope.availDates={};
            //$scope.coachAvailDates={};
            $scope.SearchMessage ="";

            $scope.cancelMessage1="Your appointment has been cancelled. You will receive a confirmation email shortly.";
//            $scope.cancelMessage2='Coach: '+coach.coachName;
//            $scope.cancelMessage3='Date/Time: '+selectedDate.dateFormat('D, M-d, H:iA');



            //alert($scope.confirmMessage + '\n'+$scope.confirmCoach+'\n'+$scope.confirmDate);
            //trigger emails/text
            schedulingService.sendSchEmails({Date:selDate,EmailOptions:$scope.EmailOptions}).then(function(data){
                console.log('success');
            });
            //window.location.reload(true);
        });
    };

    $scope.setEmailOptions = function(coachId,coachEmail,userSubj,coachSubj,userMsg,coachMsg) {
        $scope.EmailOptions.userEmail = $scope.user.Email;
        $scope.EmailOptions.coachEmail = coachEmail;
        $scope.EmailOptions.coachId=coachId;
        $scope.EmailOptions.userSubject = userSubj;
        $scope.EmailOptions.coachSubject = coachSubj;
        $scope.EmailOptions.userMsg = userMsg;
        $scope.EmailOptions.coachMsg = coachMsg;
    }
}]);

