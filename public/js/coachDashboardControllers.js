coachDashboardModule.controller('coachDashBoardController',['$scope','$http','$log','coachDashboardServices', function($scope,$http,$log,coachDashboardServices) {

    /*********************************************************************/
    $scope.initApp=function() {
        $log.log('coachDashBoardController initialized');

        /*********************************************************************
         *** on init, get coach info, users for the coach and coach schedule
         *********************************************************************/

        coachDashboardServices.getCoachInfo().then(function(data){
            $scope.Coach=data;
            $scope.coachMin = {coachId:data._id,coachName:data.FirstName+' '+data.LastName,coachPhone:data.Phone,coachEmail:data.Email};
            $scope.FirstName = data.FirstName;
            console.log($scope.FirstName);

            //now get the coach's upcoming schedule
            coachDashboardServices.getCoachAppts($scope.coachMin.coachId).then(function(appts){
                $scope.upcomingAppts=appts;
                console.log($scope.upcomingAppts)
            })
        });

        coachDashboardServices.getCoachUsers().then(function(data){
            $scope.users=data;
        });

        //initialize the calendar array
        $scope.calendarArray=[];
        $scope.calendarArray.Dates=[];

        //initialize the array to hold data of availability from db
        $scope.coachAvailDates = [];

        // To setup the calendar with availabilities,
        // 1. get the availabilties into $scope.coachAvailDates
        // 2. create an empty calendar
        // 3. update the calendar with availabilities
        coachDashboardServices.getCoachSchedule().then(function(data){
            $scope.coachAvailDates=data;
            console.log($scope.coachAvailDates);
            //populate the calendar
            $scope.setupCalendar();
            $scope.updateCalendar();
        })

    }; //END of initApp

    /****************************************************************
     This method will setup tha calendar with a start date and time.
     The date is based on the current date and time starts with 9:00am
     *****************************************************************/
    $scope.setupCalendar = function(){
        // Define display params - based on these values, we'll setup the calendar display
        // 0 empty, 1 - Coach Available,, 2 - appt booked

        //if we arrive for the first time, the calendar is empty and we use the current date.
        //When arriving by next/prev buttons, clear out the array first and use the current start
        // date to setup the range

        while($scope.calendarArray.Dates.length > 0) {
            //console.log('inside loop');
            $scope.calendarArray.Dates.pop();
        }

        //Get the start date and time dynamically. If it doesn't exists already, use the current date
        if(!$scope.startdate){
            $scope.today= new Date();
            $scope.startdate = new Date($scope.today.getFullYear(), $scope.today.getMonth(),$scope.today.getDate(), 8,30);
        }

        //console.log('Starting calendar setup with start date - ' +$scope.startdate);

        $scope.weekEndDate = new Date($scope.startdate.getFullYear(), $scope.startdate.getMonth(),$scope.startdate.getDate()+13);
        //console.log( $scope.weekEndDate.dateFormat('d Y'));
        $scope.WeekRange=$scope.startdate.dateFormat('M d - ') +  $scope.weekEndDate.dateFormat('M d, Y');

        $scope.startdate.setDate($scope.startdate.getDate()-1);
        //console.log($scope.startdate);

        var dispTime = 0;
        var dispDate = 0;
        for(var i =0;i<=14;i++ ){
            var dt = new Date($scope.startdate.getFullYear(), $scope.startdate.getMonth(),$scope.startdate.getDate()+i,$scope.startdate.getHours() ,$scope.startdate.getMinutes());

            //console.log(dt);
            $scope.calendarArray.Dates.push({Date:dt.dateFormat('m/d/Y'),DateDisp:dt.dateFormat('D, m/d'),Times:[]});
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
                var dtTime = new Date(dt.getFullYear(), dt.getMonth(),dt.getDate(),dt.getHours() ,$scope.startdate.getMinutes()+j*30);

                //console.log('Time = ' + dtTime);
                $scope.calendarArray.Dates[i].Times.push({time:dtTime.dateFormat('h:iA'),timeUTC:dtTime,DispFlag:0});
            }
        }

    };/*******END SETUP CALENDAR*******/

    // Updates the calendar with availability and appointments
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
                            $scope.calendarArray.Dates[j].Times[k].Appt=userappt;
                            //console.log('Appt');
                            //console.log(userappt);
                        }else{
                            $scope.calendarArray.Dates[j].Times[k].DispFlag = 1;
                        }
                    }
                }
            }
        }
    }; /*******END UPDATE CALENDAR*******/


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
    /****************************************************************
     *  Handle Next/Prev calendar buttons
     /****************************************************************/
    $scope.updateWeek= function(action){
        console.log('inside update week');
        if(action=='next'){
            //console.log('select next week');
            $scope.startdate.setDate($scope.startdate.getDate()+15);
            //console.log($scope.startdate);
        }
        if(action=='prev'){
            //console.log('select prev week');
            $scope.startdate.setDate($scope.startdate.getDate()-13);
            //console.log($scope.startdate);
        }

        $scope.setupCalendar();
        $scope.updateCalendar();

    };
    /****************************************************************/

    //this removed the date-time from the coachAvailDates array that maps to the DB
    //Removing from the display table is handled by checkbox handler methods
    $scope.removeDate = function(d) {
        var inputDate = d.dateFormat('m/d/Y');
        var inputTime = d.dateFormat('h:iA');
        //console.log(d);
        //console.log($scope.coachAvailDates);

        for(var i in $scope.coachAvailDates) {
            if($scope.coachAvailDates[i].Date == inputDate && $scope.coachAvailDates[i].Time == inputTime) {
                //console.log('Date exists');
                //console.log('Date and time found - ready to splice the array');
                $scope.coachAvailDates.splice(i,1);
                //console.log('coachAvailDates after delete');
                //console.log($scope.coachAvailDates);
                break;
            }
        }

    };

    $scope.addDate = function(d) {
        $log.log(d);
        var inputDate = d.dateFormat('m/d/Y');
        var inputTime = d.dateFormat('h:iA');
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
        console.log('after adding a date');
        console.log($scope.coachAvailDates);
    };

    // Save schedule
    $scope.saveSchedule = function() {
        console.log('calling save Schedule');

        var coachSchedule = {};
        coachSchedule = {TimeSlots:$scope.coachAvailDates,CoachId:$scope.Coach._id};
        console.log($scope.coachAvailDates);
        coachDashboardServices.saveCoachSchedule(coachSchedule).then(function(data){
            $scope.ConfirmMessage="Thanks for updating your schedule";
        });/**********END Save Schedule***********/

    };

}]);

/*******************************************************************************************************************
 * *****************************************************************************************************************
 * ***************  SEPARATE CONTROLLER FOR USER DETAILS ON THE DASHBOARD
 * *****************************************************************************************************************
 ********************************************************************************************************************/

coachDashboardModule.controller('userDetailsController',['$scope','$http','$log','coachDashboardServices', function($scope,$http,$log,coachDashboardServices) {
    $scope.initApp=function() {
        $log.log('userDetailsController initialized');

        // get the user details first
        coachDashboardServices.getUserProfile().then(function (data) {
            //$scope.data = wwCoachingService.userProfile();
            $log.log('inside controller');
            $log.log(data);
            $scope.FirstName = data.pilotProfile.FirstName;
            $scope.LastName = data.pilotProfile.LastName;
            $scope._id = data.pilotProfile._id;
            $scope.Age = data.wwProfile.Age;
            $scope.Gender = data.wwProfile.Gender;
            $scope.Height = data.wwProfile.Height;
            $scope.Weight = data.wwProfile.Weight;
            $scope.MinSafeWeight = data.wwProfile.MinSafeWeight;
            $scope.MaxSafeWeight = data.wwProfile.MaxSafeWeight;
            $scope.User= data.pilotProfile;
            $scope.WWUser = data.wwProfile;
            $scope.notes = data.pilotProfile.CallNotes;
            if(!$scope.notes){
                $scope.notes=[];
            }
            $log.log($scope.notes);
            coachDashboardServices.getUserAssessment($scope._id).then(function(data){
                $scope.Assessment=data.Assessment;
            })
        });

        coachDashboardServices.getCoachInfo().then(function(data){
            $scope.Coach=data;
            console.log($scope.Coach);
            $scope.FirstName = data.FirstName;
        });
    };


    $scope.savenote = function() {
        console.log($scope.User);
        var callDate = new Date();

        if($scope.newnote.callid == null) {

            //$scope.newnote.date=$('#pickdatetime').val(); //hack because the ng-model does not bind with datepicker
            $scope.newnote.userid=$scope.User._id;
            $scope.newnote.callid = $scope.notes.length +1;
            $scope.newnote.date=callDate.dateFormat('M-d-Y, H:i');
            console.log($scope.newnote) ;
            $scope.notes.push($scope.newnote);

            coachDashboardServices.saveCallNotes($scope.newnote);

            console.log($scope.notes);
        } else {
            $scope.newnote.userid=$scope.User._id;
            //for existing contact, find this contact using id
            //and update it.
            for(var i in $scope.notes) {
                if($scope.notes[i].callid == $scope.newnote.callid) {
                    //console.log('date = '+ $scope.newnote.date);
                    $scope.notes[i] = $scope.newnote;
                }
            }
            coachDashboardServices.updateCallNotes($scope.newnote);
            //console.log($scope.newnote);

        }
        //clear the add contact form
        $scope.newnote = {};

    };

    $scope.deleteNote = function(id) {

        //search note with given id and delete it
        for(var i in $scope.notes) {
            if($scope.notes[i].callid == id) {
                $scope.newnote.userid=$scope.User._id
                $scope.newnote.callid= id;

                //console.log($scope.newnote);
                coachDashboardServices.deleteCallNotes($scope.newnote);
                $scope.notes.splice(i,1);
            }
            $scope.newnote = {};
        }

    };
    //clear the add contact form
    $scope.newnote = {};

    $scope.edit = function(id) {
        console.log('note id = '+id);
        //search contact with given id and update it
        for(var i in $scope.notes) {
            if($scope.notes[i].callid == id) {
                //we use angular.copy() method to create
                //copy of original object
                console.log('id = '+ $scope.notes[i].callid + '  date = '+ $scope.notes[i].date);
                $scope.newnote = angular.copy($scope.notes[i]);
                console.log($scope.newnote.date);
                $('#pickdatetime').val(($scope.notes[i].date));
            }
        }
    };

}]);