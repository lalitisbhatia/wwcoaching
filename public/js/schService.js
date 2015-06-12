'use strict';
participantModule.factory('schedulingService',function($http,$log,$q,$rootScope){
    var myService = {
        getCoachesByDate: function (date,currDate) {
            return $http({
                method: 'GET',
                url: '/searchAvails/date/'+date +'/'+currDate
            })
                .success(function(data) {
                    //$log.info("Successfully retrieved availability for all coaches.");

                    //$log.log(data);
                })
                .error(function(status, headers, config){
                    $log.log('failed to coach availabilities' + status);
                })
                .then(function(response) {
                    var results = [];
                    results=response.data;
                    //console.log(results);
                    return results;
                });

        },
        getCoachesById: function (coachId) {
            var currDate = new Date();
            return $http({
                method: 'GET',
                url: '/searchAvails/coach/'+coachId+'/'+currDate
            })
                .success(function(data) {
                    //$log.info("Successfully retrieved availability for all coaches.");

                    //$log.log(data);
                })
                .error(function(status, headers, config){
                    $log.log('failed to coach availabilities' + status);
                })
                .then(function(response) {
                    var results = [];
                    results=response.data;
                    //console.log(results);
                    return results;
                });

        },
        getUserAppts: function (userId) {
            return $http({
                method: 'GET',
                url: '/searchAppts/user/'+userId
            })
                .success(function(data) {
                    //$log.info("Successfully retrieved availability for all coaches.");

                    //$log.log(data);
                })
                .error(function(status, headers, config){
                    $log.log('failed to coach availabilities' + status);
                })
                .then(function(response) {
                    var results = [];
                    results=response.data;
                    //console.log(results);
                    return results;
                });

        },
        saveAppt:function(appt){
            return $http({
                method:'POST',
                url: '/saveAppt',
                data: appt
            })
                .then(function(response){
                    return(response.data);
                });
        },
        sendSchEmails:function(emailData){
            return $http({
                method:'POST',
                url: '/email',
                data: emailData
            })
                .then(function(response){
                    return(response.data);
                });
        },
        cancelAppt:function(appt){
            return $http({
                method:'POST',
                url: '/cancelAppt',
                data: appt
            })
                .then(function(response){
                    return(response.data);
                });
        }
    };

    return myService;

});