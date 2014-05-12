'use strict';
adminModule.factory('adminService',function($http,$log,$q,$rootScope){
    var deffered = $q.defer();
    var promise;

    var myService = {};
    var data = [];


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


    /*******************************************************
     * Get all users for the pilot
     * @type {{}}
     */
    var allUsers={};
    myService.getAllUsers = function(){
        if(!promise){
            promise= $http({
                method: 'GET',
                url: '/users'
                })
                .success(function(data) {
                    $log.info("Successfully retrieved all users.");
                    allUsers = data;
                    deffered.resolve();
                })
                .error(function(status, headers, config){
                    $log.log('failed to users: ' + status);
                });
            return deffered.promise;
        } // closing brace for if(!promise)
    };

    myService.allUsers = function () {
        return allUsers;
    };
    /*******************************************************
     * Get all users for the pilot
     * @type {{}}
     */
    var allCoaches={};
    myService.getAllCoaches = function(){
        if(!promise){
            promise= $http({
                method: 'GET',
                url: '/coaches'
                })
                .success(function(data) {
                    $log.info("Successfully retrieved all users.");
                    allCoaches = data;
                    deffered.resolve();
                })
                .error(function(status, headers, config){
                    $log.log('failed to users: ' + status);
                });
            return deffered.promise;
        } // closing brace for if(!promise)
    };

    myService.allCoaches = function () {
        return allCoaches;
    };

    return myService;
});