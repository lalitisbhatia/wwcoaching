'use strict';
participantModule.factory('participantService',function($http,$log,$q,$rootScope){

    var myService = {
        /**************************************************************************
         ** User's pilot profile to be made available to all controllers
         **************************************************************************/
        //we'll use this vale to share across the app among different controllers
        PilotUser:{},

        //this is the method that sets the value of the PilotUser property and calls the method to do the broadcasting
        prepForBroadcast:function(pilotUser) {
            this.PilotUser = pilotUser;
            this.broadcastUser();
        },
        //this is the method that broadcasts/publishes the event 'handleUserBroadcast'
        broadcastUser:function() {
            $rootScope.$broadcast('handleUserBroadcast');
        },
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
        addNewUser:function(user){
            return $http({
                method:'POST',
                url: '/registerParticipant',
                data: user
            })
                .success(function (d, status, headers, config) {
                    //console.log(d);
                })
                .error(function(status, headers, config){
                    console.log('failed to save user:' + status);
                })
                .then(function(response){
                    var results = [];
                    results=response.data;
                    //console.log(results);
                    return results;
                })
        },
        //method to get a specific user's profile
        getUserProfile:function(wwLoginInfo,pilotLoginInfo){
            var deferred = $q.defer();
            var userProfile={};
            return $http({
                method:'POST',
                url: 'https://mobile.weightwatchers.com/authservice.svc/login',
                data: wwLoginInfo,
                xhrFields: {
                    withCredentials: true
                },
                processData: false
            })
                .then(function(response){
                    userProfile.wwProfile =response.data.UserInformation;
                    //console.log('logging user profile with wwProfile');
                    //console.log(userProfile.wwProfile );
                    if(response.data.LoginSuccessful) {
                        $http({
                            method: 'POST',
                            url: '/participant',
                            data: pilotLoginInfo
                        })
                            .success(function (data) {
                                //$log.info("Successfully retrieved user  WW info.");
                                //$log.info(data);
                            })
                            .then(function (response) {
                                userProfile.pilotUser = response.data;
                                //console.log('logging user profile with ww profile');
                                //console.log(userProfile);
                                deferred.resolve(userProfile);
                            });
                        return deferred.promise;
                    }else
                    {
                        return "Pilot user not found";
                    }
                })

        }
    };

    return myService;

});