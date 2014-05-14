//controller for coaches to choose their availability
coachingModule.controller('CoachAvailController',['$scope','$http','$log','wwCoachingService',function($scope,$http,$log,wwCoachingService){

    $scope.initApp=function() {
        $log.log('initialized CoachAvailController');
        $scope.newDate= {};
        $('#datetimepicker').datetimepicker({
            format:'D,M-d, H:iA',
            inline:true,
            lang:'en',
            //minTime:'10:00',
            //maxTime:'20:00',
            allowTimes:[
                '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30',
                '15:00', '15:30', '16:00', '16:30','17:00', '17:30', '17:00', '17:30','18:00', '18:30', '19:00',
                '19:30','20:00', '20:30', '21:00', '22:30','23:00'
            ],
            step:30
            ,
            onSelectTime:function(dp,$input){
                $scope.addDate($('#datetimepicker').val());

            }
        });
    };

    //Handle broadcast of coach
    $scope.$on('handleCoachBroadcast', function() {
        $scope.Coach = wwCoachingService.Coach;
        console.log('printing coach info from scheduler controller');
        console.log($scope.Coach);
    });
    //these are the availability dates already saved by the user ( to be retrieved from db)
    $scope.savedDates = [ {id:1,date:'Tue,May-13, 9:30AM'},{id:2,date:'Tue,May-14, 8:30AM'}];

    $scope.removeDate = function(d) {
        var dateId = d.next("input[type='hidden']").val();
        console.log(dateId);
        d.parent().remove();

        for(var i in $scope.savedDates) {
            if($scope.savedDates[i].id == dateId) {
                $scope.savedDates.splice(i,1);
            }
            $scope.newDate = {};
        }
        //console.log('savedDates after delete');
        //console.log($scope.savedDates);

    };

    $scope.addDate = function(d) {
        //check if the date is already selected
        if ($.grep($scope.savedDates, function(e){ return e.date == d; }).length>0){
            console.log('already added ' + d);
        }else{
            $scope.newDate.id=$scope.savedDates.length + 1;
            $scope.newDate.date = d;

            $scope.savedDates.push($scope.newDate);
            console.log($scope.savedDates);
            $('#fakeSave').click();
            //$('#dates').append("<li style='padding-top: 5px; color: #bd362f;'>" + $scope.newDate.date + "<a href='#' style='padding-left: 30px;'><b>X</b></a><input type='hidden' value=" +$scope.newDate.id + "></li>");
            $scope.newDate={};
        }
    };

    $('#dates').on('click','a',function(){
        $scope.removeDate($(this));
    });

    $scope.saveSchedule = function() {
        console.log('calling save Schedule');

        var newSchedule = {};
        newSchedule.Coach = $scope.Coach;
        newSchedule.Dates = $scope.savedDates;
        console.log(newSchedule);

    };

}]);