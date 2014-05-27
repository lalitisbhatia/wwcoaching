participantModule.controller('ParticipantLoginController', ['$scope','$http','$routeParams','$log','participantService','searchService', function($scope,$http,$routeParams,$log,participantService,searchService) {
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
            $scope.wwProfile = data.wwProfile;
            $scope.pilotUser= data.pilotUser;

            window.location.replace("/participant/"+$scope.firstname+"/"+$scope.lastname);
        });

    };
}]);

participantModule.controller('ParticipantSchController', ['$scope','$http','$routeParams','$log','participantService','searchService', function($scope,$http,$routeParams,$log,participantService,searchService) {
    $scope.initSchPage=function() {
        $log.log('initialized initSchPage');
        $scope.coaches=[];
        participantService.getAllCoaches().then(function(data){
            $scope.coaches = data;
//            console.log($scope.coaches);
        });

        //get user information

        $scope.predicate = 'Date';
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
                searchService.getCoachesByDate(dateUTC).then(function(data){
                    $scope.setSearchResults(data);
                });


            }
        });
    };


    $('#coachselect').change(function(){
        var coachId = $(this).children("option:selected").val();
        console.log($(this).children("option:selected").text()  + ' selected');
        //search for coaches using coachId
        searchService.getCoachesById(coachId).then(function(data){
            $scope.setSearchResults(data);
        });
    });

    $scope.getCoachesById= function(coachId){
        console.log('inside function - coach id = '+coachId);
        searchService.getCoachesById(coachId).then(function(data){
            $scope.setSearchResults(data);
        });
    };

    $scope.setSearchResults = function(data){
        $scope.availDates = data;
        if($scope.availDates.length>0){
            $scope.SearchMessage = "Following coaches are available on or around " + $scope.SelectedDate;
        }else{
            $scope.SearchMessage = "No coaches are available on or around " + $scope.SelectedDate +".\n Please search using a different date or search by coach name.";
        }
        $log.log($scope.availDates);
    };

    $scope.saveUserAppt = function(coach,selDate) {
        console.log('calling save Schedule');

//        var selDate = $scope.SelectedDateUTC;
        //var selDate = new Date($scope.SelectedDateUTC);
        //console.log($scope.SelectedDateUTC.dateFormat('m/d/Y H:i'));
        console.log(selDate);

        console.log(coach);
        var appt = {Date:selDate,CoachId:coach.coachId};
        console.log(appt);
        $http({
            method:'POST',
            url: '/saveAppt',
            data: appt
        })
            .success(function (d, status, headers, config) {
                console.log('success');
                console.log(d);
                $scope.availDates={};
                $scope.SearchMessage ="";
                $scope.confirmMessage="Thanks for making an appointment. You will receive a confirmation email shortly. Here are your appointment details:";
                //trigger emails/text
                $http({
                    method:'POST',
                    url: '/email',
                    data: {Date:selDate,Coach:coach}
                })
                    .success(function(d,status,headers,config){
                        console.log('success');
                    })
                    .error(function(status, headers, config){
                        console.log('failed to send email:' + status + ' - ' + headers );
                    });
            })
            .error(function(status, headers, config){
                console.log('failed to save schedule:' + status + ' - ' + headers );
            });
        $scope.ConfirmMessage="Thanks for updating your schedule";
    };

}]);

