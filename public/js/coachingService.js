'use strict';
myApp.factory('wwCoachingService',function($http,$log,$q){
    var deffered = $q.defer();
    var promise;
    var userProfile={};
    var myService = {};
    var data = []; 
    
    myService.greeting = 'hello wsdfgdf';
    
    myService.setGreeting = function(newGreeting) {
            this.greeting = newGreeting;
        };
        
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
                    //$log.info('logging user profile');
                    //$log.info(data);
                    var loginInfo = { "U": data.Username, "P": data.Password, "R": "true" };
                    //$log.log(loginInfo);
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
    
    myService.getAssessmentResults = function(){
        
    }
   
    
    return myService;
    

});