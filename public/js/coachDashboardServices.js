'use strict';
coachDashboardModule.factory('coachDashboardServices',function($http,$log,$q,$rootScope){

    var myService ={
        //method for coach details - this will also  have the associated users

        //method to get a specific user's profile
//        getUserProfile:function(){
//            var deferred = $q.defer();
//            var userProfile={};
//            var path = '';
//            path=window.location.pathname;
//            path =path.replace('getuser','users');
//            return $http({
//                method: 'GET',
//                url: path
//            })
//                .then(function(response){
//                    userProfile.pilotProfile =response.data;
//                    //console.log('logging user profile with pilot profile');
//                    //console.log(userProfile.pilotProfile );
//                    var loginInfo = { "U": response.data.Username, "P": response.data.Password, "R": "true" };
//
//                    //console.log(response.data);
//                    $http({
//                        method:'POST',
//                        url: 'https://mobile.weightwatchers.com/authservice.svc/login',
//                        data: loginInfo
//                    })
//                        .success(function(data) {
//                            //$log.info("Successfully retrieved user  WW info.");
//                            //$log.info(data);
//                        })
//                        .then(function(response){
//                            userProfile.wwProfile = response.data.UserInformation;
//                            //console.log('logging user profile with ww profile');
//                            //console.log(userProfile);
//                            deferred.resolve(userProfile);
//                        });
//                    return deferred.promise;
//                });
//
//        },
        getUserProfile:function(){
            var userProfile={};
            var path = '';
            path=window.location.pathname;
            path =path.replace('getuser','users');
            return $http({
                method: 'GET',
                url: path
            })
                .error(function(status, headers, config){
                    $log.log('failed to get participant info :' + status);
                })
                .then(function(response){
                    console.log('logging return from service');
                    console.log(response.data);
                    return response.data;
                });

        },
        getNestedDataBetter: function (){
            //create your deferred promise.
            var deferred = $q.defer();

            //do your thing.
            $http.get('parents.json')
                .then(function(result){
                    var parents = result.data;
                    $http.get('children.json')
                        .then(function(result) {
                            var children = result.data;
                            angular.forEach(parents, function(parent) {
                                parent.children = [];
                                angular.forEach(children, function(child) {
                                    if(parent.childIds.indexOf(child.id) >= 0) {
                                        parent.children.push(child);
                                    }
                                });
                            });

                            //at whatever point in your code, you feel your
                            // code has loaded all necessary data and/or
                            // resolve your promise.
                            deferred.resolve(parents);
                        });
                });

            //return your promise to the user.
            return deferred.promise;
        },
        getCoachInfo:function(){
            return $http({
                method: 'GET',
                url: '/coachinfo'
            })
                .success(function(data) {
                    $log.info("Successfully retrieved coach info.");
                })
                .error(function(status, headers, config){
                    $log.log('failed to get coach info :' + status);
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        getCoachUsers:function(){
            return $http({
                method: 'GET',
                url: '/cusers'
            })
                .success(function(data) {
                    $log.info("Successfully retrieved users for coach.");
                })
                .error(function(status, headers, config){
                    $log.log('failed to get users for coach :' + status);
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        getCoachSchedule:function(){
            return $http({
                method: 'GET',
                url: '/getCoachAvails'
            })
                .success(function (data, status, headers, config) {
                    console.log('after getting coach avails');
                })
                .error(function(status, headers, config){
                    console.log('failed to get schedules:' + status);
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        getCoachAppts: function (coachId) {
            return $http({
                method: 'GET',
                url: '/searchCoachAppts/coach/'+coachId
            })
                .success(function(data) {
                    $log.info("Successfully retrieved appts for all coach.");
                })
                .error(function(status, headers, config){
                    $log.log('failed to coach appts' + status);
                })
                .then(function(response) {
                    return response.data;
                });

        },
        saveCoachSchedule:function(schedule){
            return $http({
                method:'POST',
                url: '/addCoachAvails',
                data: schedule
            })
                .success(function (d, status, headers, config) {
                    console.log('Successfully saved schedule');
                })
                .error(function(status, headers, config){
                    console.log('failed to save schedule:' + status);
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        saveCallNotes:function(newnote){
            return $http({
                method:'POST',
                url: '/addCallNote',
                data: newnote
            })
                .success(function (d, status, headers, config) {
                    console.log('Successfully saved note');
                })
                .error(function(status, headers, config){
                    console.log('failed to save note:' + status);
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        updateCallNotes:function(note){
            return $http({
                method:'POST',
                url: '/updateCallNote',
                data: note
            })
                .success(function (d, status, headers, config) {
                    console.log('Successfully update note');
                })
                .error(function(status, headers, config){
                    console.log('failed to update note:' + status);
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        deleteCallNotes:function(note){
            return $http({
                method:'POST',
                url: '/deleteCallNote',
                data: note
            })
                .success(function (d, status, headers, config) {
                    console.log('Successfully delete note');
                })
                .error(function(status, headers, config){
                    console.log('failed to delete note:' + status);
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        getUserAssessment:function(userId){
            return $http({
                method: 'GET',
                url: '/assessment/'+userId
            })
                .success(function(data) {
                    $log.info("Successfully retrieved assessment for user "+ userId);
                })
                .error(function(status, headers, config){
                    $log.log('failed to get assessment for user '+ userId );
                })
                .then(function(response) {
                    //console.log(response.data);
                    return response.data;
                });
        },
        emailActionPlan:function(emailData){
            return $http({
                method:'POST',
                url: '/emailActionPlan',
                data: emailData
            })
                .then(function(response){
                    return(response.data);
                });
        }


    };

    return myService;
});