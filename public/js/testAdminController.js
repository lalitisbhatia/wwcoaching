'use strict';

adminModule.controller('testAllUsersController',  function AllCoachesController($scope,$http,$log,testAdminService) {
    $scope.initApp=function() {
        $scope.coaches=[];
        $scope.users=[];
        testAdminService.getAllUsers().then(function(data){
            $scope.users = data;
            console.log($scope.users);
        });

        testAdminService.getAllCoaches().then(function(data){
            $scope.coaches = data;
            console.log($scope.coaches);
        });

    };

});



