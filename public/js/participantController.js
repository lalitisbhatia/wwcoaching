participantModule.controller('ParticipantLoginController', ['$scope','$http','$routeParams','$log','participantService','schedulingService', function($scope,$http,$routeParams,$log,participantService,schedulingService) {
    $scope.initApp=function(){
        $log.log('participantController initialized');

        var ln = $('#lastname').val();
        var fn = $('#firstname').val();

        $scope.username = '';
        $scope.password='';
        $scope.wwProfile='';
        $scope.firstname=fn;
        $scope.lastname=ln;
        $scope.errMessage='';
        $scope.participantId="";
        $scope.saveWWCreds=true;
        console.log($scope.firstname + ' ' + $scope.lastname);
    };

    /*****************************************************
    *** Method to register user to the pilot portal
     ******************************************************/
    $scope.saveuser = function() {
        console.log($scope.newuser);
        participantService.addNewUser($scope.newuser).then(function(data){
            console.log('logging return from add user');
            console.log(data);
            window.location.reload(true);
        });

    };

    $scope.getWWDetails = function(){
        console.log($scope.username + ' - ' + $scope.password);
        var loginInfo = { "U": $scope.username, "P": $scope.password, "R": "true" };
        //var saveWWCreds = $('#chksave').is(":checked");

        var pilotUser = {};
        if($scope.saveWWCreds) {
            pilotUser = {"firstname": $scope.firstname, "lastname": $scope.lastname, SaveWWCreds: $scope.saveWWCreds,username:$scope.username,password:$scope.password};
        }else{
            pilotUser = {"firstname": $scope.firstname, "lastname": $scope.lastname, SaveWWCreds: $scope.saveWWCreds};
        }
        console.log(pilotUser);
        participantService.getUserProfile(loginInfo,pilotUser).then(function(data){
            if(data.LoginSuccessful){
                $scope.wwProfile = data.wwProfile;
                $scope.pilotUser= data.pilotUser;
                window.location.replace("/participant/"+$scope.firstname+"/"+$scope.lastname);
            }else{
                $scope.errMessage="Failed to validate WW credentials. Please try again"
            }

        });

    };

}]);


participantModule.controller('ParticipantSchController', ['$scope','$http','$routeParams','$log','participantService','schedulingService', function($scope,$http,$routeParams,$log,participantService,schedulingService) {
    $scope.initSchPage=function(coachId,userId) {
        $log.log('initialized initSchPage');

        console.log('coachId: '+coachId);
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
            console.log($scope.user);
        });

        // get availability for the user's coach by default on page load
        if(coachId){
            console.log('getting availabilities for coach '+coachId);
            schedulingService.getCoachesById(coachId).then(function(data){
                $scope.setSearchResultsCoach(data);
            });
        }
        //get te user's upcoming appointments
        schedulingService.getUserAppts(userId).then(function(data){
            console.log('getting user appts');
            $scope.setUserAppts(data);
            console.log(data);
        });


        $('#datepicker').datetimepicker({
            format:'d-M-y H:i',
            //inline:true,
            lang:'en',
            hours12:true,
            //minTime:'10:00',
            //maxTime:'20:00',
            allowTimes:[
                '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30',
                '15:00', '15:30', '16:00', '16:30','17:00', '17:30', '17:00', '17:30','18:00', '18:30', '19:00',
                '19:30','20:00', '20:30', '21:00', '21:30','22:00'
            ],
            step:30
            ,
            onSelectTime:function(dp,$input){
                $log.log('date selected');
                var dateString = $('#datepicker').val();
                var date = new Date(dateString);
                var dateUTC = new Date(dateString);
                //console.log('date  = ' + date );
                //console.log('date string = ' + dateString );
                console.log('dateUTC from search = ' + dateUTC );

                $scope.SelectedDate = date.dateFormat('d-M-y, h:i A');
                $scope.SelectedDateUTC =dateUTC;
                console.log('$scope.SelectedDateUTC = ' + $scope.SelectedDateUTC);

                $('#fakeSave').click();

                //Call the service to return results
                schedulingService.getCoachesByDate(dateUTC).then(function(data){
                    $scope.setSearchResults(data);
                });


            }
        });
    };


    $('#coachselect').change(function(){
        var coachId = $(this).children("option:selected").val();
        console.log($(this).children("option:selected").text()  + ' selected');
        //search for coaches using coachId
        schedulingService.getCoachesById(coachId).then(function(data){
            $scope.setSearchResults(data);
        });
    });



    //this is for the participantFirst viiew
    $scope.setSearchResults = function(data){
        $scope.availDates = data;
        if($scope.availDates.length>0){
            $scope.SearchMessage = "Following coaches are available on or around " + $scope.SelectedDate;
        }else{
            $scope.SearchMessage = "No coaches are available on or around " + $scope.SelectedDate +".\n Please search using a different date or search by coach name.";
        }

    };

    //default availability of users's coach
    $scope.setSearchResultsCoach = function(data){
        console.log('inside setSearchResultsCoach ');
        $scope.coachAvailDates = data;
    };

    //set user's upcoming appointments
    $scope.setUserAppts = function(data){
        console.log('inside setSearchResultsCoach ');
        $scope.userAppts = data;
    };

    $scope.saveUserAppt = function(coach,selDate) {
        console.log('calling save Appt');
        var selectedDate = new Date(selDate);
        var msgCoach="Hi "+coach.coachName +",\n "+ $scope.userName +" has booked a call with you for " +selectedDate.dateFormat('D,M-d, H:iA T');
        var msgUser="Hi "+$scope.user.FirstName + " ,\n Your coaching call with " +coach.coachName+" is scheduled for " +selectedDate.dateFormat('D,M d, H:iA T')+'. Have a great session';
        var subj='Your Coaching session is booked';
        $scope.setEmailOptions(coach.coachId,coach.coachEmail,subj,msgUser,msgCoach);
        console.log($scope.EmailOptions);

        console.log(selectedDate);

        console.log(coach);
//        console.log($scope.coach);
        var appt = {Date:selDate,Coach:coach};
        console.log(appt);

        schedulingService.saveAppt(appt).then(function(data){
            $scope.availDates={};
            $scope.coachAvailDates={};
            $scope.SearchMessage ="";

            $scope.confirmMessage="Thanks for making an appointment. You will receive a confirmation email shortly. Here are your appointment details:";
            $scope.confirmCoach='Coach: '+coach.coachName;
            $scope.confirmDate='Date/Time: '+selectedDate.dateFormat('D, M-d, H:iA T');


            alert($scope.confirmMessage + '\n'+$scope.confirmCoach+'\n'+$scope.confirmDate);

            //trigger emails/text
            schedulingService.sendSchEmails({Date:selectedDate,EmailOptions:$scope.EmailOptions}).then(function(data){
                console.log('success');
            });
            window.location.reload(true);
        });
    };

    $scope.cancelUserAppt = function(coach,selDate) {
        console.log('calling cancel Appt');
        var selectedDate = new Date(selDate);
        var msgCoach="Hi "+$scope.coachName +",\n "+ $scope.userName +" has cancelled a call with you  for " +selectedDate.dateFormat('D,M-d, H:iA');
        var msgUser="Hi "+$scope.userName + " ,\n You have cancelled a call with " +$scope.coachName+" for " +selectedDate.dateFormat('D,M-d, H:iA');
        var subj='Coaching session cancelled';
        $scope.setEmailOptions(coach.coachId,coach.coachEmail,subj,msgUser,msgCoach);
        console.log($scope.EmailOptions);
        //console.log(selectedDate);
        //console.log(coach);

        var appt = {Date:selDate,Coach:coach};
        console.log(appt);
        schedulingService.cancelAppt(appt).then(function(data){
            $scope.availDates={};
            $scope.coachAvailDates={};
            $scope.SearchMessage ="";



            $scope.confirmMessage="Your appointment has been cancelled. You will receive a confirmation email shortly. Here are your appointment details:";
            $scope.confirmCoach='Coach: '+coach.coachName;
            $scope.confirmDate='Date/Time: '+selectedDate.dateFormat('D, M-d, H:iA');



            alert($scope.confirmMessage + '\n'+$scope.confirmCoach+'\n'+$scope.confirmDate);
            //trigger emails/text
            schedulingService.sendSchEmails({Date:selDate,EmailOptions:$scope.EmailOptions}).then(function(data){
                console.log('success');
            });
            window.location.reload(true);
        });
    };

    $scope.setEmailOptions = function(coachId,coachEmail,subj,userMsg,coachMsg) {
        $scope.EmailOptions.userEmail = $scope.user.Email;
        $scope.EmailOptions.coachEmail = coachEmail;
        $scope.EmailOptions.coachId=coachId;
        $scope.EmailOptions.subject = subj;
        $scope.EmailOptions.userMsg = userMsg;
        $scope.EmailOptions.coachMsg = coachMsg;
    }
}]);

