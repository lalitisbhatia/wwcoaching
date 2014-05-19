//controller for coaches to choose their availability
coachingModule.controller('SchController',['$scope','$http','$log','$filter','wwCoachingService',function($scope,$http,$log,$filter,wwCoachingService){

    $scope.initApp=function() {
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
                '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30',
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
                $scope.dispAvailDates = $scope.groupBy(data,'Date','Time');
                //console.log($scope.coachAvailDates);
                console.log($scope.dispAvailDates);
            })
            .error(function(status, headers, config){
                console.log('failed to get schedules:' + status);
            })
    });
    //these are the availability dates already saved by the user ( to be retrieved from db)


    $scope.removeDate = function(d) {
        //remove is based on the data-date and data-time attributes of the link
        //by finding the date and time in teh coachAvailDates array and splicing it
        var inputDate = d.attr('data-date');
        var inputTime = d.attr('data-time');
        //console.log(d);
        //console.log(inputDate + ' - ' + inputTime);
        console.log($scope.coachAvailDates);

        for(var i in $scope.coachAvailDates) {
            if($scope.coachAvailDates[i].Date == inputDate && $scope.coachAvailDates[i].Time == inputTime) {

                //console.log('Date exists');
                //console.log('Date and time found - ready to splice the array');
                $scope.coachAvailDates.splice(i,1);
                $('#fakeSave').click();
                //console.log('coachAvailDates after delete');
                //console.log($scope.coachAvailDates);
                break;
            }
        }
        //now remove from display array as well
        removeFromDisplayArray(inputDate,inputTime);

    };

    $scope.addDate = function(d,dp) {
        $log.log(dp);
        var inputDate = dp.dateFormat('m/d/Y');
        var inputTime = dp.dateFormat('H:i');
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
            console.log('dateUTC from add= ' + dateUTC);
            $scope.coachAvailDates.push( {Date:inputDate,Time:inputTime,DateUTC:dateUTC,Coach:$scope.coachMin});
        }

        /************************************************************************
         * Bit of a HACK for now. Maintaining 2 arrays - one for saving,
         * one for display. The one for displayis grouped by time
         * fix it later by going to http://jsfiddle.net/4Dpzj/6/
         *************************************************************************/
        addToDisplayArray(inputDate,inputTime);

        //console.log($scope.coachAvailDates);
        $('#fakeSave').click();
        //console.log($scope.dispAvailDates);
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
    $scope.groupBy = function( collection,attribute,field ) {
        //this goes 2 levels deep
        // First, reset the groups.
        var retArray = [];
        var fieldName = field;
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

            group.Times.push( { time :row[field]} );

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

/*##################################################
 ################ User View #######################
 ##################################################
 */

//controller for coaches to choose their availability
coachingModule.controller('UserSchedulingController',['$scope','$http','$log','$filter','wwCoachingService',function($scope,$http,$log,$filter,wwCoachingService){

    $scope.initApp=function() {
        //$log.log('initialized UserSchedulingController');
        //$scope.availDates = [];

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
                $scope.SearchMessage = "Following coaches are available on or around " + $scope.SelectedDate;
                $('#fakeSave').click();

                $http({
                    method: 'GET',
                    url: '/searchAvails/'+dateUTC
                })
                    .success(function(data) {
                        $log.info("Successfully retrieved availability for all coaches.");
                        //re-sort data

                        $scope.availDates = data;
                        $log.log($scope.availDates);
                    })
                    .error(function(status, headers, config){
                        $log.log('failed to coach availabilities' + status);
                    });


            }
        });
    };

    $scope.saveUserAppt = function(coachId) {
        console.log('calling save Schedule');

        var schedule = {};
        var selDate = new Date($scope.SelectedDateUTC);
        console.log(selDate.dateFormat('m/d/Y H:i'));
        console.log(selDate);

        var dateString = $('#datepicker').val();
        var date = new Date(dateString);
        var dateUTC = new Date(dateString);
        console.log(coachId);
//        coachSchedule = {TimeSlots:$scope.coachAvailDates,CoachId:$scope.Coach._id};
//        console.log(coachSchedule);
//        $http({
//            method:'POST',
//            url: '/addCoachAvails',
//            data: coachSchedule
//        })
//            .success(function (d, status, headers, config) {
//                console.log(d);
//            })
//            .error(function(status, headers, config){
//                console.log('failed to save schedule:' + status);
//            })
//        $scope.ConfirmMessage="Thanks for updating your schedule";
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

}]);
