'use strict';
participantModule.factory('participantService',function($http,$log,$q,$rootScope){
    var deffered = $q.defer();
    var promise;
    var userProfile={};
    var myService = {};



    /**************************************************************************
     ** User's pilot profile to be made available to all controllers
     **************************************************************************/

    myService.PilotUser ; //we'll use this vale to share across the app among different controllers

    //this is the method that sets the value of the PilotUser property and calls the method to do the broadcasting
    myService.prepForBroadcast = function(pilotUser) {
        this.PilotUser = pilotUser;
        this.broadcastUser();
    };

    //this is the method that broadcasts/publishes the event 'handleUserBroadcast'
    myService.broadcastUser = function() {
        $rootScope.$broadcast('handleUserBroadcast');
    };


    //this method gets the user's pilot profile and then the ww profile
    myService.getUserProfile = function(user,pwd){

        var path = '';
        path=window.location.pathname;
        path =path.replace('getuser','users');
        if(!promise){
                    var loginInfo = { "U": user, "P": pwd, "R": "true" };
                    console.log(loginInfo);
                    $http({
                        method:'POST',
                        url: 'https://mobile.weightwatchers.com/authservice.svc/login',
                        data: loginInfo
                    })
                        .success(function (d, status, headers, config) {
                            //$log.log(d);
                            userProfile.wwProfile = d.UserInformation;
                            deffered.resolve();
                        })
                        .error(function(status, headers, config){
                            $log.log('failed to get WW profile:' + status);
                        })


            return deffered.promise;
        } // closing brace for if(!promise)
    };

    myService.userProfile = function () {
        return userProfile;
    };

    return myService;

});