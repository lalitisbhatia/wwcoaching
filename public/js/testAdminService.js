'use strict';
adminModule.factory('testAdminService',function($http,$log,$q,$rootScope){
    var myService = {
        getAllUsers: function () {
            return $http({
                    method: 'GET',
                    url: '/users'
                })
                    .success(function (data) {
                        $log.info("Successfully retrieved all users for a coach.");
                    })
                    .error(function (status, headers, config) {
                        $log.log('failed to users: ' + status);
                    })
                    .then(function(response) {
                        var results = [];
                        results=response.data;
                        //console.log(results);
                        return results;
                    });

            } ,
        getAllCoaches: function () {
            return $http({
                method: 'GET',
                url: '/coaches'
            })
                .success(function (data) {
                    $log.info("Successfully retrieved all coaches.");
                })
                .error(function (status, headers, config) {
                    $log.log('failed to coaches: ' + status);
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