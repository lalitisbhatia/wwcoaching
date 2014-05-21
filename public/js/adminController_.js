'use strict';

adminModule.controller('AdminController',  function AdminController($scope,$http,$log,AdminService) {
    $scope.initApp=function() {
        $scope.coaches=[];
        AdminService.getAllCoaches().then(function(data){
            $scope.coaches = data;
            console.log($scope.coaches);
        });

        $scope.users=[];
        AdminService.getAllUsers().then(function(data){
            $scope.users = data;
            console.log($scope.users);
        });
    };

    /**********************************************
     **** handle CRUD operations for Coaches ********
     *********************************************/

    $scope.savecoach = function() {
        //console.log($scope.newcoach);
        if($scope.newcoach._id == null) {

            console.log($scope.newcoach) ;


            AdminService.addNewCoach($scope.newcoach).then(function(data){
                console.log('logging return from add coach');
                console.log(data);
                $scope.coaches.push(data);
            });
//          console.log($scope.coaches);
        } else {
            console.log('updating coach');

            //for existing contact, find this user using id
            //and update it.
            for(var i in $scope.coaches) {
                if($scope.coaches[i]._id == $scope.newcoach._id) {
                    $scope.coaches[i] = $scope.newcoach;
                }
            }
            console.log($scope.newcoach);
            AdminService.updateCoach($scope.newcoach).then(function(data){
                console.log('logging return from updating coach');
                console.log(data);
            });
        }
        //  clear the add contact form
        $scope.newcoach = {};

    };

    $scope.deleteCoach = function(id) {
        console.log(id);
        //search coach with given id and delete it
        for(var i in $scope.coaches) {
            if($scope.coaches[i]._id == id) {
                $scope.newcoach._id= id;
                console.log($scope.newcoach);
                AdminService.deleteCoach($scope.newcoach,function(data){
                    console.log(data);

                });
                $scope.coaches.splice(i,1);
            }
            $scope.newcoach = {};
        }

    };
    //clear the add coach form
    $scope.newcoach = {};

    $scope.editCoach = function(id) {
        console.log('coach id = '+id);
        //search coach with given id and update it
        for(var i in $scope.coaches) {
            if($scope.coaches[i]._id == id) {
                //we use angular.copy() method to create
                //copy of original object
                console.log('id = '+ $scope.coaches[i]._id);
                $scope.newcoach = angular.copy($scope.coaches[i]);
            }
        }
    };
    /**********************************************
     **** handle CRUD operations for Users ********
     *********************************************/

    $scope.saveuser = function() {
        console.log($scope.newuser);
        if($scope.newuser._id == null) {

            console.log($scope.newuser) ;


            AdminService.addNewUser($scope.newuser).then(function(data){
                console.log('logging return from add user');
                console.log(data);
                $scope.users.push(data);
            });
            //console.log($scope.users);
        } else {
            console.log('updating user');

            //for existing contact, find this user using id
            //and update it.
            for(var i in $scope.users) {
                if($scope.users[i]._id == $scope.newuser._id) {
                    $scope.users[i] = $scope.newuser;
                }
            }
            console.log($scope.newuser);
            AdminService.updateUser($scope.newuser).then(function(data){
                console.log('logging return from updating user');
                console.log(data);
            });
        }
        //  clear the add contact form
        $scope.newuser = {};

    };

    $scope.deleteUser = function(id) {
        console.log(id);
        //search user with given id and delete it
        for(var i in $scope.users) {
            if($scope.users[i]._id == id) {
                $scope.newuser._id= id;
                console.log($scope.newuser);
                AdminService.deleteUser($scope.newuser,function(data){
                    console.log(data);

                });
                $scope.users.splice(i,1);
            }
            $scope.newuser = {};
        }

    };
    //clear the add user form
    $scope.newuser = {};

    $scope.editUser = function(id) {
        console.log('user id = '+id);
        //search user with given id and update it
        for(var i in $scope.users) {
            if($scope.users[i]._id == id) {
                //we use angular.copy() method to create
                //copy of original object
                console.log('id = '+ $scope.users[i]._id);
                $scope.newuser = angular.copy($scope.users[i]);
            }
        }
    };

});