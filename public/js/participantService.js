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

        },
        //method to get a specific user's profile
        getUserProfile:function(wwLoginInfo,pilotLoginInfo){
            var deferred = $q.defer();
            var userProfile={};
            return $http({
                method: 'GET',
                url: path
            })
                .then(function(response){
                    userProfile.pilotProfile =response.data;
                    //console.log('logging user profile with pilot profile');
                    //console.log(userProfile.pilotProfile );
                    var loginInfo = { "U": response.data.Username, "P": response.data.Password, "R": "true" };

                    //console.log(response.data);
                    $http({
                        method:'POST',
                        url: 'https://mobile.weightwatchers.com/authservice.svc/login',
                        data: loginInfo
                    })
                        .success(function(data) {
                            //$log.info("Successfully retrieved user  WW info.");
                            //$log.info(data);
                        })
                        .then(function(response){
                            userProfile.wwProfile = response.data.UserInformation;
                            //console.log('logging user profile with ww profile');
                            //console.log(userProfile);
                            deferred.resolve(userProfile);
                        });
                    return deferred.promise;
                });

        }
    };

    return myService;

});