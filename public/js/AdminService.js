'use strict';
adminModule.factory('AdminService',function($http,$log,$q,$rootScope){

    var myService = {
        getAllUsers: function () {
            return $http({
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
                    results=response.data;
                    //console.log(results);
                    return results;
                });

        },
        addNewUser:function(user){
            return $http({
                method:'POST',
                url: '/addUser',
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
        updateUser:function(user) {
            return $http({
                method: 'POST',
                url: '/updateUser',
                data: user
            })
                .success(function (d, status, headers, config) {
                    //console.log(d);
                })
                .error(function (status, headers, config) {
                    console.log('failed to save user:' + status);
                })
                .then(function (response) {
                    var results = [];
                    results = response.data;
                    //console.log(results);
                    return results;
                })
        },
        deleteUser:function(user){
            $http({
                method:'POST',
                url: '/deleteUser',
                data: user
            })
                .success(function (data, status, headers, config) {
                    console.log('Successful call to db - ' + data);
                    return data;
                })
                .error(function(status, headers, config){
                    console.log('failed to delete coach:' + status);
                })

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
                    $log.log('failed to coaches: ' + status);
                })
                .then(function(response) {
                    var results = [];
                    results=response.data;
                    //console.log(results);
                    return results;
                });

        },
        addNewCoach:function(coach){
            return $http({
                method:'POST',
                url: '/addCoach',
                data: coach
            })
                .success(function (d, status, headers, config) {
                    //console.log(d);
                })
                .error(function(status, headers, config){
                    console.log('failed to save coach:' + status);
                })
                .then(function(response){
                    var results = [];
                    results=response.data;
                    //console.log(results);
                    return results;
                })
        },
        updateCoach:function(coach) {
            return $http({
                method: 'POST',
                url: '/updateCoach',
                data: coach
            })
                .success(function (d, status, headers, config) {
                    //console.log(d);
                })
                .error(function (status, headers, config) {
                    console.log('failed to save coach:' + status);
                })
                .then(function (response) {
                    var results = [];
                    results = response.data;
                    //console.log(results);
                    return results;
                })
        },
        deleteCoach:function(coach){
            $http({
                method:'POST',
                url: '/deleteCoach',
                data: coach
            })
                .success(function (data, status, headers, config) {
                    console.log('Successful call to db - ' + data);
                    return data;
                })
                .error(function(status, headers, config){
                    console.log('failed to delete coach:' + status);
                })

        }
    };

    return myService;

});