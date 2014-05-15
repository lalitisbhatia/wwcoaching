//controller for coaches to choose their availability
coachingModule.controller('SchedulingController',['$scope','$http','$log','$filter','wwCoachingService',function($scope,$http,$log,$filter,wwCoachingService){

    $scope.initApp=function() {
        $log.log('initialized CoachAvailController');
        $scope.savedDates = [
//            {Date:'13-May-14',Times:[{time:'12:00'},{time:'10:30'},{time:'12:30'},{time:'15:30'},{time:'08:30'},{time:'13:30'}]},
//            {Date:'15-May-14',Times:[{time:'12:00'},{time:'11:30'},{time:'14:30'}]},
//            {Date:'11-May-14',Times:[{time:'11:00'},{time:'11:30'},{time:'14:30'}]}
        ];
        $log.log($scope.savedDates);
        $scope.newDate= {};
        $('#datetimepicker').datetimepicker({
            format:'d-M-y H:i',
            inline:true,
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

                var dateString = $('#datetimepicker').val();
                var date = new Date(dateString);
                console.log('date  = ' + date );
                console.log('date string = ' + dateString );
                $scope.addDate(date ,dp);
            }
        });
    };

    //Handle broadcast of coach
    $scope.$on('handleCoachBroadcast', function() {
        $scope.Coach = wwCoachingService.Coach;
        //console.log($scope.Coach);
        //$scope.savedDates = [];
        // now that the coach info is loaded, get the coach schedules
        $http({
            method: 'GET',
            url: '/getCoachAvails'
        })
        .success(function (data, status, headers, config) {
            $scope.savedDates=data.Appointments;
            // convert appointments to time format
            //console.log(data);
        })
        .error(function(status, headers, config){
            console.log('failed to get schedules:' + status);
        })
    });
    //these are the availability dates already saved by the user ( to be retrieved from db)


    $scope.removeDate = function(d) {
        //remove is based on the data-date and data-time attributes of the link
        //by finding the date and time in teh savedDates array and splicing it
        var inputDate = d.attr('data-date');
        var inputTime = d.attr('data-time');
        console.log(d);
        console.log(inputDate + ' - ' + inputTime);
        //console.log($scope.savedDates);

        for(var i in $scope.savedDates) {
            if($scope.savedDates[i].Date == inputDate) {
                //console.log('Date exists');
                //check if time also exists
                for(var j in $scope.savedDates[i].Times){
                    if($scope.savedDates[i].Times[j].time == inputTime){
                        //console.log('Date and time found - ready to splice the array');
                        $scope.savedDates[i].Times.splice(j,1);

                        //if the date has no more times, remove the date as well
                        if($scope.savedDates[i].Times.length == 0){
                            $scope.savedDates.splice(i,1);
                        }
                        $('#fakeSave').click();
                        //console.log('savedDates after delete');
                        //console.log($scope.savedDates);
                        break;
                    }
                }
            }

        }

    };

    $scope.addDate = function(d,dp) {
        $log.log(dp);
        var inputDate = dp.dateFormat('d-M-y');
        var inputTime = dp.dateFormat('H:i');
        var dateExists = false;
        var timeExists = false;

        $scope.newDate.Date =inputDate;
        $scope.newDate.Times=[{time:inputTime}];

        // Before adding to the array of dates, check if the date already exists in savedDates.
        // If so, only add the time
        for(var i in $scope.savedDates) {
            if($scope.savedDates[i].Date == inputDate) {
                dateExists = true;
                //check if time also exists
                for(var j in $scope.savedDates[i].Times){
                    if($scope.savedDates[i].Times[j].time == inputTime){
                        timeExists = true;
                        console.log('Date and time already exist - do nothing');
                        break;
                    }
                }
                if(!timeExists){
                    console.log('date exists but not time - add time to the list');
                    $scope.savedDates[i].Times.push({time:inputTime});
                }
                //out of loop to check time
                break;
            }

        }
        if(!dateExists){
            console.log('date does not exists -  add date and times');
            $scope.savedDates.push($scope.newDate);
        }

         console.log($scope.savedDates);
         $('#fakeSave').click();
         //$('#dates').append("<li style='padding-top: 5px; color: #bd362f;'>" + $scope.newDate.date + "<a href='#' style='padding-left: 30px;'><b>X</b></a><input type='hidden' value=" +$scope.newDate.id + "></li>");
         $scope.newDate={};
    };

    $('#dates').on('click','a',function(){
        console.log('clicked');
        $scope.removeDate($(this));
    });

    $scope.saveSchedule = function() {
        console.log('calling save Schedule');

        var newSchedule = {};
        newSchedule.Coach = $scope.Coach;
        newSchedule.Dates = $scope.savedDates;
        console.log(newSchedule);
        $http({
            method:'POST',
            url: '/addCoachAvails',
            data: newSchedule
        })
        .success(function (d, status, headers, config) {
            console.log(d);
        })
        .error(function(status, headers, config){
            console.log('failed to save schedule:' + status);
        })
        $scope.ConfirmMessage="Thanks for updating your schedule";
    };

    $scope.orderProp = 'time';
}]);