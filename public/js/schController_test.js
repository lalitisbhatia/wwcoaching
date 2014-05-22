//controller for coaches to choose their availability
coachingModule.controller('SchController_test',['$scope','$http','$log','$filter','wwCoachingService',function($scope,$http,$log,$filter,wwCoachingService){

    $scope.initApp=function() {

        //Define the times of the day available to coaches
        $scope.availTimes=[
            '08:30','09:00','09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30','17:00', '17:30','18:00', '18:30', '19:00',
            '19:30','20:00', '20:30', '21:00', '21:30','22:00'
        ];

        //initialize the calendar array
        $scope.calendarArray=[];
        $scope.calendarArray.Dates=[];
        //populate the calendar
        $scope.setupCalendar();
        //console.log('$scope.calendarArray');
        //console.log($scope.calendarArray);

        //initialize the array to hold data of availability from db
        $scope.coachAvailDates = [];
    };

    /****************************************************************
        This method will setup tha calendar with a start date and time.
        The date is based on the current date and time starts with 9:00am
     *****************************************************************/
    $scope.setupCalendar = function(){
        // Define display params - based on these values, we'll setup the calendar display
        // 0 empty, 1 - Coach Available,, 2 - appt booked

        //Get the start date and time dynamically
        var today= new Date();
        var startdate = new Date(today.getFullYear(), today.getMonth(),today.getDate(), 8,30);
        //console.log('todayStart = ' + todayStart.dateFormat('m/d/Y h:iA'));
        //console.log('todayStartUTC = ' + Date.parse(todayStart));

        startdate.setDate(today.getDate()-1);
        console.log(startdate);

        var dispTime = 0;
        var dispDate = 0;
        for(var i =0;i<=10;i++ ){
            var dt = new Date(startdate.getFullYear(), startdate.getMonth(),startdate.getDate()+i,startdate.getHours() ,startdate.getMinutes());

            //console.log(dt);
            $scope.calendarArray.Dates.push({Date:dt.dateFormat('m/d/Y'),Times:[]});
            for(var j =0;j<26;j++){
//                if(i==0 && j==0) {
//                    dispTime = 1;
//                    dispDate = 1;
//                }else if(i==0 && j>0){
//                    dispTime = 0;
//                    dispDate = 1;
//                }else if(i>0 && j==0){
//                    dispTime = 1;
//                    dispDate = 0;
//                }else{
//                    dispTime = 1;
//                    dispDate = 1;
//                }
                //increase time by 30 minute increments
                var dtTime = new Date(dt.getFullYear(), dt.getMonth(),dt.getDate(),dt.getHours() ,startdate.getMinutes()+j*30);

                //console.log('Time = ' + dtTime);
                $scope.calendarArray.Dates[i].Times.push({time:dtTime.dateFormat('H:i'),timeUTC:dtTime,DispFlag:0});
            }
        }

    };

    //Handle broadcast of coach
    $scope.$on('handleCoachBroadcast', function() {
        $scope.Coach = wwCoachingService.Coach;
        $scope.coachMin = {coachId:$scope.Coach._id,coachName:$scope.Coach.FirstName+' '+$scope.Coach.LastName,coachPhone:$scope.Coach.Phone,coachEmail:$scope.Coach.Email};

        //console.log($scope.coachMin);
        //$scope.coachAvailDates = [];
        // now that the coach info is loaded, get the coach schedules
        $http({
            method: 'GET',
            url: '/getCoachAvails'
        })
            .success(function (data, status, headers, config) {
                $scope.coachAvailDates=data;
                console.log($scope.coachAvailDates);
                //once coach availabilities are received, update the calendar
                $scope.updateCalendar();
                console.log('after getting coach avails');
                //console.log($scope.calendarArray.Dates);

            })
            .error(function(status, headers, config){
                console.log('failed to get schedules:' + status);
            })
    });


    $scope.updateCalendar = function(){
        for(var i in $scope.coachAvailDates){
            //console.log($scope.coachAvailDates[i].Date + '--' + $scope.coachAvailDates[i].Time);
            var availdate = $scope.coachAvailDates[i].Date;
            var availtime = $scope.coachAvailDates[i].Time;
            var userappt = $scope.coachAvailDates[i].User;
            //loop thru the $scope.calendarArray array
            for(var j in $scope.calendarArray.Dates){
                for(var k in $scope.calendarArray.Dates[j].Times){
                    if(availdate== $scope.calendarArray.Dates[j].Date && availtime==$scope.calendarArray.Dates[j].Times[k].time){
                        //console.log('found match');
                        if(userappt) {
                            //console.log(availtime + '-'+availdate);
                            $scope.calendarArray.Dates[j].Times[k].DispFlag = 2;
                        }else{
                            $scope.calendarArray.Dates[j].Times[k].DispFlag = 1;
                        }
                    }
                }
            }
        }
    };

    /* ****************************************************************
        these 2 functions handle clicks on the calendar checkboxes
     *****************************************************************/
    $scope.updateSelection = function($event, d) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        console.log(action + '-' + d );

        updateSelected(action, d);
    };

    var updateSelected = function(action, d) {
        //update the $scope.coachAvailDates and $scope.calendarArray arrays
        if (action === 'add' ) {
            $scope.addDate(d);
        }
        if (action === 'remove' ) {
            $scope.removeDate(d);
        }
    };
    /****************************************************************/


    $scope.removeDate = function(d) {
        //remove is based on the data-date and data-time attributes of the link
        //by finding the date and time in teh coachAvailDates array and splicing it
        var inputDate = d.dateFormat('m/d/Y');
        var inputTime = d.dateFormat('H:i');
        //console.log(d);
        //console.log(inputDate + ' - ' + inputTime);
        console.log($scope.coachAvailDates);

        for(var i in $scope.coachAvailDates) {
            if($scope.coachAvailDates[i].Date == inputDate && $scope.coachAvailDates[i].Time == inputTime) {

                //console.log('Date exists');
                //console.log('Date and time found - ready to splice the array');
                $scope.coachAvailDates.splice(i,1);
                //$('#fakeSave').click();
                //console.log('coachAvailDates after delete');
                //console.log($scope.coachAvailDates);
                break;
            }
        }

    };

    $scope.addDate = function(d) {
        $log.log(d);
        var inputDate = d.dateFormat('m/d/Y');
        var inputTime = d.dateFormat('H:i');
        var timeSlotExists = false;
        var timeExists = false;

        // Before adding to the array of dates, check if the date already exists in coachAvailDates.
        // If so, only add the time
        for(var i in $scope.coachAvailDates) {
            if ($scope.coachAvailDates[i].Date == inputDate && $scope.coachAvailDates[i].Time == inputTime) {
                console.log('Date and time already exist - do nothing');
                timeSlotExists = true;
                break;
            }
        }
        if(!timeSlotExists){
            var dateUTC = new Date(d);
            //console.log('d input= ' + d);
            //console.log('dateUTC from add= ' + dateUTC);
            $scope.coachAvailDates.push( {Date:inputDate,Time:inputTime,DateUTC:d,Coach:$scope.coachMin});
        }

        console.log($scope.coachAvailDates);
    };

    $scope.saveSchedule = function() {
        console.log('calling save Schedule');

        var coachSchedule = {};
        coachSchedule = {TimeSlots:$scope.coachAvailDates,CoachId:$scope.Coach._id};
        console.log($scope.coachAvailDates);
        $http({
            method:'POST',
            url: '/addCoachAvails',
            data: coachSchedule
        })
            .success(function (d, status, headers, config) {
                console.log(d);
            })
            .error(function(status, headers, config){
                console.log('failed to save schedule:' + status);
            });
        $scope.ConfirmMessage="Thanks for updating your schedule";
    };

}]);

