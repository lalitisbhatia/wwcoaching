'use strict';

adminModule.controller('AllUsersController',  function AllCoachesController($scope,$http,$log,testAdminService) {
    $scope.initApp=function() {
        $scope.coaches=[];
        testAdminService.getAllUsers().then(function(data){
            $scope.coaches = data;
        });
    };

});



