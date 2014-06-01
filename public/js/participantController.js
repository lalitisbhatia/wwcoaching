participantModule.controller('ParticipantLoginController', ['$scope','$http','$routeParams','$log','participantService', function($scope,$http,$routeParams,$log,participantService) {
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

    };
    $scope.getWWDetails = function(){
        console.log($scope.username + ' - ' + $scope.password);
        var loginInfo = { "U": $scope.username, "P": $scope.password, "R": "true" };
        var saveWWCreds = $('#chksave').is(":checked");

        var pilotUser = {};
        if(saveWWCreds) {
            pilotUser = {"firstname": $scope.firstname, "lastname": $scope.lastname, SaveWWCreds: saveWWCreds,username:$scope.username,password:$scope.password};
        }else{
            pilotUser = {"firstname": $scope.firstname, "lastname": $scope.lastname, SaveWWCreds: saveWWCreds};
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

participantModule.controller('ParticipantRegisterController', ['$scope','$http','$routeParams','$log','participantService', function($scope,$http,$routeParams,$log,participantService) {
    $scope.initApp=function(){
        $log.log('participantController initialized');
    };

    $scope.saveuser = function() {
        console.log($scope.newuser);
        if($scope.newuser._id == null) {
            participantService.addNewUser($scope.newuser).then(function(data){
                console.log('logging return from add user');
                console.log(data);
                window.location.reload(true);
            });
            //console.log($scope.users);
        } else {
            console.log('updating user');

            //for existing contact, find this user using id
            //and update it.
            for(var i in $scope.users) {
                if($scope.users[i]._id == $scope.newuser._id) {
                    $scope.users[i] = $scope.newuser;
                }
            }
            console.log($scope.newuser);
            AdminService.updateUser($scope.newuser).then(function(data){
                console.log('logging return from updating user');
                console.log(data);
            });
        }
        //  clear the add contact form
        $scope.newuser = {};

    };


}]);

participantModule.controller('ParticipantSchController', ['$scope','$http','$routeParams','$log','participantService','schedulingService', function($scope,$http,$routeParams,$log,participantService,schedulingService) {
    $scope.initSchPage=function(coachId,userId) {
        $log.log('initialized initSchPage');
        $scope.coaches=[];
        participantService.getAllCoaches().then(function(data){
            $scope.coaches = data;
//            console.log($scope.coaches);
        });

        //get user information
        $scope.user={};
        $scope.user.coachId=coachId;
        $scope.user.userId=userId;
        // get availability for the user's coach by default on page load
        if($scope.user.coachId){
            console.log('getting availabilities for coach '+$scope.user.coachId);
            schedulingService.getCoachesById($scope.user.coachId).then(function(data){
                $scope.setSearchResultsCoach(data);
            });
        }

        //get te user's upcoming appointments
        schedulingService.getUserAppts($scope.user.userId).then(function(data){
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



    $scope.setSearchResults = function(data){
        $scope.availDates = data;
        if($scope.availDates.length>0){
            $scope.SearchMessage = "Following coaches are available on or around " + $scope.SelectedDate;
        }else{
            $scope.SearchMessage = "No coaches are available on or around " + $scope.SelectedDate +".\n Please search using a different date or search by coach name.";
        }
     //$log.log($scope.availDates);
    };

    //default availability of users's coach
    $scope.setSearchResultsCoach = function(data){
        console.log('inside setSearchResultsCoach ');
        $scope.coachAvailDates = data;
        //console.log(data);
//        if($scope.coachAvailDates.length>0){
//            $scope.CoachSearchMessage = "Following coaches are available on or around " + $scope.SelectedDate;
//        }else{
//            $scope.CoachSearchMessage = "No coaches are available on or around " + $scope.SelectedDate +".\n Please search using a different date or search by coach name.";
//        }
        //$log.log($scope.availDates);
    };

    //set user's upcoming appointments
    $scope.setUserAppts = function(data){
        console.log('inside setSearchResultsCoach ');
        $scope.userAppts = data;
    };

    $scope.saveUserAppt = function(coach,selDate) {
        console.log('calling save Appt');
        var selectedDate = new Date(selDate);
        console.log(selectedDate);
        console.log(coach);

        var appt = {Date:selDate,Coach:coach};
        console.log(appt);
        schedulingService.saveAppt(appt).then(function(data){
            $scope.availDates={};
            $scope.coachAvailDates={};
            $scope.SearchMessage ="";

            $scope.confirmMessage="Thanks for making an appointment. You will receive a confirmation email shortly. Here are your appointment details:";
            $scope.confirmCoach='Coach: '+coach.coachName;
            $scope.confirmDate='Date/Time: '+selectedDate.dateFormat('D, M-d, H:iA');
            alert($scope.confirmMessage + '\n'+$scope.confirmCoach+'\n'+$scope.confirmDate);
            //trigger emails/text
            schedulingService.sendSchEmails({Date:selDate,Coach:coach.coachId,emailType:"new"}).then(function(data){
                console.log('success');
            });
            window.location.reload(true);
        });
    };

    $scope.cancelUserAppt = function(coach,selDate) {
        console.log('calling cancel Appt');
        var selectedDate = new Date(selDate);
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
            schedulingService.sendSchEmails({Date:selDate,Coach:coach.coachId,emailType:"cancel"}).then(function(data){
                console.log('success');
            });
            window.location.reload(true);
        });
    };

}]);

