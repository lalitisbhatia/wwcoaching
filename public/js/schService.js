
coachingModule.service('schService',function($http,$log,$q){
    this.selectedDate={};
    this.coachAvails={};
    this.DatePicker={};

    var allowTimes = [
        '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30','13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30','17:00', '17:30', '18:00', '18:30', '19:00',
        '19:30','20:00', '20:30', '21:00', '21:30','22:00'
    ];

    this.createDatePicker = function(inputElem,inl){
        return $(inputElem).datetimepicker({
            format:'d-M-y H:i',
            inline:inl,
            lang:'en',
            hours12:true,
            //minTime:'10:00',
            //maxTime:'20:00',
            allowTimes:allowTimes,
            step:30
//            onSelectTime:function(dp,$input){
//                var dateString = $('#datetimepicker').val();
//                var date = new Date(dateString);
//                //console.log(Date.parse(date));
//                //console.log('date  = ' + date );
//                //console.log('date string = ' + dateString );
//                //$scope.addDate(date ,dp);
//                selectedDate = dp;
//                //console.log(selectedDate);
            //}

        });
    };

    this.getCoachAvails = function(){
//        $http({
//            method: 'GET',
//            url: '/getCoachAvails'
//        })
//            .success(function (data, status, headers, config) {
//                $scope.coachAvailDates=data;
//                $scope.dispAvailDates = $scope.groupBy(data,'Date','Time');
//                //console.log($scope.coachAvailDates);
//                console.log($scope.dispAvailDates);
//            })
//            .error(function(status, headers, config){
//                console.log('failed to get schedules:' + status);
//            })
    }

});