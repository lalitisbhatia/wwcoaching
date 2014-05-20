'use strict';
adminModule.factory('adminService',function($http,$log,$q,$rootScope){
    var myService = {
        getAllUsers: function () {
            if (!promise) {
                promise = $http({
                    method: 'GET',
                    url: '/users'
                })
                    .success(function (data) {
                        $log.info("Successfully retrieved all users.");
                    })
                    .error(function (status, headers, config) {
                        $log.log('failed to users: ' + status);
                    })
                    .then(function(response) {
                        var results = [];
                        results=response.data.d;
                        console.log(results);
                        return results;
                    });

            } // closing brace for if(!promise)
        }
    };

    return myService;

});