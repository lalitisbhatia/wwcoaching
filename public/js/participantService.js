'use strict';
participantModule.factory('participantService',function($http,$log,$q,$rootScope){
    var myService = {
        getAllCoaches: function () {
            return $http({
                method: 'GET',
                url: '/coaches'
            })
                .success(function (data) {
                    $log.info("Successfully retrieved all coaches.");
                })
                .error(function (status, headers, config) {
                    $log.log('failed to get coaches: ' + status);
                })
                .then(function(response) {
                    var results = [];
                    results=response.data;
                    //console.log(results);
                    return results;
                });

        }
    };

    return myService;

});