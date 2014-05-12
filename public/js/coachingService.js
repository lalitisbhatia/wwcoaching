'use strict';
coachingModule.factory('wwCoachingService',function($http,$log,$q,$rootScope){
    var deffered = $q.defer();
    var promise;
    var userProfile={};
    var myService = {};
    var data = []; 
    
    myService.greeting = 'hello wsdfgdf';
    
    myService.setGreeting = function(newGreeting) {
            this.greeting = newGreeting;
        };
    

    
    /**************************************************************************
     ** User's pilot profile to be made available to all controllers
    **************************************************************************/
     
    myService.PilotUser ; //we'll use this vale to share across the app among different controllers

    //this is the method that sets the value of the PilotUser property and calls the method to do the broadcasting
    myService.prepForBroadcast = function(pilotUser) {
        this.PilotUser = pilotUser;
        this.broadcastItem();
    };

    //this is the method that broadcasts/publishes the event 'handleUserBroadcast'
    myService.broadcastItem = function() {
        $rootScope.$broadcast('handleUserBroadcast');
    };
    
    /**************************************************************************/
     
    //this method gets the user's pilot profile and then the ww profile
    myService.getUserProfile = function(){
            
            var path = '';
            path=window.location.pathname;
            path =path.replace('getuser','users');
            if(!promise){
                promise= $http({
                    method: 'GET',
                    url: path
                })
                .success(function(data) { 
                    $log.info("Successfully retrieved user's pilot profile ."); 
                    userProfile.pilotProfile =data;
                    
                    
                    var loginInfo = { "U": data.Username, "P": data.Password, "R": "true" };
                    
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
                    
                });
                return deffered.promise;
            } // closing brace for if(!promise)
        };
        
     myService.userProfile = function () {
        return userProfile;
    };

//##############################################################
//############## COACH Related Services  ####################
//##############################################################    
    var coachDetails={};
    myService.getCoachDetails = function(){
        if(!promise){
            promise= $http({
                method: 'GET',
                url: '/coach'
            })
                .success(function(d) {
                    $log.info("Successfully retrieved coach info.");
                    $log.info(d);
                    coachDetails = d;
                    deffered.resolve();
                })
                .error(function(status, headers, config){
                    $log.log('failed to get detailsfor coach' + status);
                });
            return deffered.promise;
        } // closing brace for if(!promise)
    };

    myService.coachDetails = function () {
        return coachDetails;
    };

   
    var coachUsers={};
    myService.getCoachUsers = function(){
        if(!promise){
                promise= $http({
                    method: 'GET',
                    url: '/cusers'
                })
                .success(function(data) {    
                    $log.info("Successfully retrieved users for coach."); 
                    coachUsers = data;
                    deffered.resolve(); 
                })
                .error(function(status, headers, config){
                        $log.log('failed to getusers for coach' + status);
                });
                return deffered.promise;
            } // closing brace for if(!promise)
        };
        
     myService.coachUsers = function () {
        return coachUsers;
    };
    
//
//    /********************************************************
//     ******************  SCHEDULER  *************************
//     ********************************************************/
//    var coachScheduler={};
//    myService.getCoachScheduler = function(){
//         if(!promise){
//                promise= $http({
//                    method: 'GET',
//                    url: '/schedule'
//                })
//                .success(function(data) {
//                    $log.info("Successfully retrieved coachm availability.");
//                    coachScheduler = data;
//                    deffered.resolve();
//                })
//                .error(function(status, headers, config){
//                        $log.log('failed to coach availabilities' + status);
//                });
//                return deffered.promise;
//            } // closing brace for if(!promise)
//        };
//
//     myService.coachScheduler = function () {
//        return coachScheduler;
//    };
//
    
    
    return myService;
    

});