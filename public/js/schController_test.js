//controller for coaches to choose their availability
coachingModule.controller('SchController_test',['$scope','$http','$log','$filter','wwCoachingService',function($scope,$http,$log,$filter,wwCoachingService){

    $scope.initApp=function() {


        $scope.availTimes=[
            '08:30','09:00','09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30','17:00', '17:30','18:00', '18:30', '19:00',
            '19:30','20:00', '20:30', '21:00', '21:30','22:00'
        ];

        $scope.calendarArray=[];
        $scope.calendarArray.Dates=[];
        $scope.setupCalendar();
        console.log('$scope.calendarArray');
        console.log($scope.calendarArray);

        //$log.log('initialized SchController');
        $scope.coachAvailDates = [];
        $scope.dispAvailDates = [];
        $log.log($scope.coachAvailDates);
        $scope.newDate= {};
        $('#datetimepicker').datetimepicker({
            format:'d-M-y H:i',
            inline:true,
            lang:'en',
            hours12:true,
            //minTime:'10:00',
            //maxTime:'20:00',
            allowTimes:[
                '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30',
                '15:00', '15:30', '16:00', '16:30','17:00', '17:30', '17:00', '17:30','18:00', '18:30', '19:00',
                '19:30','20:00', '20:30', '21:00', '21:30','22:00'
            ],
            step:30
            ,
            onSelectTime:function(dp,$input){

                var dateString = $('#datetimepicker').val();
                var date = new Date(dateString);
                var dateUTC = Date.parse(date);

                //console.log('date string = ' + dateString );
                //console.log('date  = ' + date );
                //console.log('dateUTC on select  = ' + dateUTC );
                $scope.addDate(date ,dp);
            }
        });
    };

    $scope.setupCalendar = function(){
        //define display params
        //0 empty, 1 - Coach Available,, 2 - appt booked
        var today= new Date();
        var startdate = new Date(today.getFullYear(), today.getMonth(),today.getDate(), 8,30);
        //console.log('todayStart = ' + todayStart.dateFormat('m/d/Y h:iA'));
        //console.log('todayStartUTC = ' + Date.parse(todayStart));
        //var tt = new Date(Date.parse(todayStart));

        //console.log(today.dateFormat('m/d/Y'));
        //console.log(tt);
        //var startdate = new Date();
        //var enddate = new Date();
        startdate.setDate(today.getDate()-1);
        //enddate.setDate(today.getDate()+10);
        console.log(startdate);
        //console.log(enddate.dateFormat('m/d/Y'));

        var dispTime = 0;
        var dispDate = 0;
        for(var i =0;i<=10;i++ ){
            var dt = new Date(startdate.getFullYear(), startdate.getMonth(),startdate.getDate()+i,startdate.getHours() ,startdate.getMinutes());

            //console.log(dt);
            $scope.calendarArray.Dates.push({Date:dt.dateFormat('m/d/Y'),Times:[]});
            for(var j =0;j<26;j++){
                if(i==0 && j==0) {
                    dispTime = 1;
                    dispDate = 1;
                }else if(i==0 && j>0){
                    dispTime = 0;
                    dispDate = 1;
                }else if(i>0 && j==0){
                    dispTime = 1;
                    dispDate = 0;
                }else{
                    dispTime = 1;
                    dispDate = 1;
                }
                var dtTime = new Date(dt.getFullYear(), dt.getMonth(),dt.getDate(),dt.getHours() ,startdate.getMinutes()+j*30);

                //console.log('Time = ' + dtTime);
                $scope.calendarArray.Dates[i].Times.push({time:dtTime.dateFormat('H:i'),timeUTC:dtTime,DispFlag:0});
            }
        }

    };

    //Handle broadcast of coach
    $scope.$on('handleCoachBroadcast', function() {
        $scope.Coach = wwCoachingService.Coach;
        $scope.coachMin = {coachId:$scope.Coach._id,coachName:$scope.Coach.FirstName+' '+$scope.Coach.LastName,coachPhone:$scope.Coach.Phone};

        //console.log($scope.coachMin);
        //$scope.coachAvailDates = [];
        // now that the coach info is loaded, get the coach schedules
        $http({
            method: 'GET',
            url: '/getCoachAvails'
        })
            .success(function (data, status, headers, config) {
                $scope.coachAvailDates=data;
                $scope.dispAvailDates = $scope.groupBy(data,'Date','Time','User');
                console.log($scope.coachAvailDates);
                console.log($scope.dispAvailDates);
                $scope.updateCalendar();
                console.log('after getting coach avails');
                console.log($scope.calendarArray.Dates);
                //no match the coachAvailDates with calendar
            })
            .error(function(status, headers, config){
                console.log('failed to get schedules:' + status);
            })
    });
    //these are the availability dates already saved by the user ( to be retrieved from db)

    $scope.updateCalendar = function(){
        for(var i in $scope.coachAvailDates){
            //console.log($scope.coachAvailDates[i].Date + '--' + $scope.coachAvailDates[i].Time);
            var availdate = $scope.coachAvailDates[i].Date;
            var availtime = $scope.coachAvailDates[i].Time;
            //loop thru the $scope.calendarArray array
            for(var j in $scope.calendarArray.Dates){
                //console.log($scope.calendarArray.Dates[j].Date + ' - ' + availdate);
                //if(availdate== $scope.calendarArray.Dates[j].Date){console.log('found date match')}
                for(var k in $scope.calendarArray.Dates[j].Times){
                    if(availdate== $scope.calendarArray.Dates[j].Date && availtime==$scope.calendarArray.Dates[j].Times[k].time){
                        console.log('found match');
                        $scope.calendarArray.Dates[j].Times[k].DispFlag=1;
                    }
                }
            }
        }
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

    $scope.updateSelection = function($event, d) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        console.log(action + '-' + d );

        updateSelected(action, d);
    };

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
        //now remove from display array as well
        //removeFromDisplayArray(inputDate,inputTime);

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

        /************************************************************************
         * Bit of a HACK for now. Maintaining 2 arrays - one for saving,
         * one for display. The one for displayis grouped by time
         * fix it later by going to http://jsfiddle.net/4Dpzj/6/
         *************************************************************************/
//        addToDisplayArray(inputDate,inputTime);
//
        console.log($scope.coachAvailDates);
//        $('#fakeSave').click();
//        //console.log($scope.dispAvailDates);
    };

    $('#dates').on('click','a',function(){
        //console.log('clicked');
        //cross out the display
        //$(this).parent().attr('style','text-decoration:line-through;');
        $scope.removeDate($(this));
    });

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

    // I sort the given collection on the given property.
    function sortOn(collection, name) {

        collection.sort(
            function (a, b) {
                var c = new Date(a[ name ]);
                var d = new Date(b[ name ]);
                if (c <=  d) {
                    return( -1 );
                }
                return( 1 );
            }
        );

    }

    // -- Define Scope Methods. ----------------- //

    // I group the  list on the given attribute.
    $scope.groupBy = function( collection,attribute,field1,field2 ) {
        //this goes 2 levels deep
        // First, reset the groups.
        var retArray = [];
        var fieldName1 = field1;
        var fieldName2 = field2;
        // Now, sort the collection  on the grouping-property.
        // This just makes it easier to split the collection.
        sortOn( collection, attribute );
        //console.log(collection);
        // I determine which group we are currently in.
        var groupValue = "_INVALID_GROUP_VALUE_";

        // As we loop over each first element(Date), add it to the
        // current group - we'll create a NEW group every
        // time we come across a new attribute value.
        for ( var i = 0 ; i < collection.length ; i++ ) {

            var row = collection[ i ];

            // Should we create a new group?
            if ( row[ attribute ] != groupValue ) {

                var group = {
                    Date: row[ attribute ],
                    Times: []
                };
                //console.log('created new group : ' +group);

                groupValue = group.Date;

                retArray.push( group );

            }

            // Add the 2nd element to the currently active
            // grouping.

            group.Times.push( { time :row[field1],User:row[field2]} );

        }
        //console.log(retArray);
        return retArray;
    };


    /*######################################################
     ################ HACK FUNCTIONS #######################
     #######################################################
     */

    function addToDisplayArray(inputDate,inputTime){
        // Update the dispaly array now:
        // Before adding to the array of dates, check if the date already exists in savedDates.
        // If so, only add the time
        var newDate={};
        newDate.Date =inputDate;
        newDate.Times=[{time:inputTime}];

        var dispDateExists = false;
        var dispTimeExists = false;
        for(var i in $scope.dispAvailDates) {
            if($scope.dispAvailDates[i].Date == inputDate) {
                dispDateExists = true;
                //check if time also exists
                for(var j in $scope.dispAvailDates[i].Times){
                    if($scope.dispAvailDates[i].Times[j].time == inputTime){
                        dispTimeExists = true;
                        console.log('Date and time already exist - do nothing');
                        break;
                    }
                }
                if(!dispTimeExists){
                    console.log('date exists but not time - add time to the list');
                    $scope.dispAvailDates[i].Times.push({time:inputTime});
                }
                //out of loop to check time
                break;
            }

        }
        if(!dispDateExists){
            console.log('date does not exists -  add date and times');
            $scope.dispAvailDates.push(newDate);
        }
    }

    function removeFromDisplayArray(inputDate,inputTime){
        console.log(inputDate + ' - ' + inputTime);
        //console.log($scope.dispAvailDates);

        for(var i in $scope.dispAvailDates) {
            if($scope.dispAvailDates[i].Date == inputDate) {
                //console.log('Date exists');
                //check if time also exists
                for(var j in $scope.dispAvailDates[i].Times){
                    if($scope.dispAvailDates[i].Times[j].time == inputTime){
                        //console.log('Date and time found - ready to splice the array');
                        $scope.dispAvailDates[i].Times.splice(j,1);

                        //if the date has no more times, remove the date as well
                        if($scope.dispAvailDates[i].Times.length == 0){
                            $scope.dispAvailDates.splice(i,1);
                        }
                        $('#fakeSave').click();
                        //console.log('savedDates after delete');
                        //console.log($scope.savedDates);
                        break;
                    }
                }
            }

        }
    }
}]);

