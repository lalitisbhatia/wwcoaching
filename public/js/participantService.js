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
                    //$log.info("Successfully retrieved all coaches.");
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
        getUserProfile:function(wwLoginInfo,username){

            var userProfile={};

            var loginInfo= {WWLoginInfo:wwLoginInfo,Username:username}
            return $http({
                method:'POST',
                url:'/participant',
                data:loginInfo
            })
                .error(function(status, headers, config){
                    return ('failed validate WW credentials:' + status);

                })
                .then(function(response){
                    userProfile.LoginSuccessful =response.data.LoginSuccessful;
                    userProfile.Role = response.data.Role;
                    userProfile.ParticipantInfo= response.data.ParticipantInfo;
                    return userProfile;
                })
        },
//        getUserProfile:function(wwLoginInfo,pilotUserInfo){
//            var deferred = $q.defer();
//            var userProfile={};
//            return $http({
//                method:'POST',
//                url: 'https://mobile.weightwatchers.com/authservice.svc/login',
//                data: wwLoginInfo,
//                xhrFields: {
//                    withCredentials: true
//                },
//                processData: false
//            })
//                .error(function(status, headers, config){
//                    return ('failed validate WW credentials:' + status);
//
//                })
//                .then(function(response){
//                    userProfile.wwProfile =response.data.UserInformation;
//                    userProfile.LoginSuccessful =response.data.LoginSuccessful;
//                    //console.log('logging user profile with wwProfile');
//                    //console.log(userProfile.wwProfile );
//                    if(response.data.LoginSuccessful) {
//                        pilotUserInfo.WWInfo=response.data.UserInformation;
//                        pilotUserInfo.WWLoginInfo=wwLoginInfo;
//                        //console.log(pilotUserInfo);
//                        $http({
//                            method: 'POST',
//                            url: '/participant',
//                            data: pilotUserInfo
//                        })
//                            .success(function (data) {
//                                //$log.info("Successfully retrieved user  WW info.");
//                                $log.info(data);
//                            })
//                            .then(function (response) {
//                                userProfile.pilotUser = response.data;
//                                //console.log('logging user profile with ww profile');
//                                //console.log(userProfile);
//                                deferred.resolve(userProfile);
//                            });
//                        return deferred.promise;
//                    }else
//                    {
//                        return response.data;
//                    }
//                })
//
//        },
        getCoachInfo:function(id){
            return $http({
                method: 'GET',
                url: '/coaches/'+id
            })
                .success(function(data) {
                    //$log.info("Successfully retrieved coach info.");
                })
                .error(function(status, headers, config){
                    $log.log('failed to get coach info :' + status);
                })
                .then(function(response) {
                    //console.log(response);
                    return response.data;
                });
        },
        getUserInfo:function(id){
            return $http({
                method: 'GET',
                url: '/users/'+id
            })
                .success(function(data) {
                    //$log.info("Successfully retrieved user info.");
                })
                .error(function(status, headers, config){
                    $log.log('failed to get user info :' + status);
                })
                .then(function(response) {
                    //console.log(response);
                    return response.data;
                });
        }
    };

    return myService;

});