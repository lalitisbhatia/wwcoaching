
//##############################################################
//############## COACH Related Controllers  ####################
//##############################################################

adminModule.controller('AllCoachesController', ['$scope','$http','$log','adminService', function($scope,$http,$log,adminService) {
    $scope.initApp=function() {
        console.log('Getting all coaches info');
        $http({
            method: 'GET',
            url: '/coaches'
        })
            .success(function (data, status, headers, config) {
                console.log((data.FirstName));
                $scope.coaches = data;

                //call the broadcast method to set the coaches globally
                $scope.setCoaches($scope.coaches);
            });
    };

    $scope.setCoaches = function(coaches){
        //broadcast the user
        adminService.prepForBroadcast(coaches);
    };

}]);


//List of users for a coach
adminModule.controller('AllUsersController',['$scope','$http','$log','adminService', function($scope,$http,$log,adminService) {
    $scope.initApp=function() {
        adminService.getAllUsers().then(function () {
            $scope.users = adminService.allUsers();
            $log.log($scope.users);
            $log.log($scope.coaches);
        });
    }
    var coachesDD =[];
    $scope.$on('handleCoachesBroadcast', function(){
        $scope.coaches=adminService.Coaches;
    });

    /**********************************************
     **** handle CRUD operations for users ********
     *********************************************/

    $scope.saveuser = function() {
        console.log($scope.newuser);
        if($scope.newuser._id == null) {

            console.log($scope.newuser) ;
            $scope.users.push($scope.newuser);

            $http({
                method:'POST',
                url: '/addUser',
                data: $scope.newuser
            })
                .success(function (d, status, headers, config) {
                    console.log(d);
                })
                .error(function(status, headers, config){
                    console.log('failed to save user:' + status);
                })
            console.log($scope.users);
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
            $http({
                method:'POST',
                url: '/updateUser',
                data: $scope.newuser
            })
                .success(function (d, status, headers, config) {
                    console.log('Successful call to db - ' + d);
                })
                .error(function(status, headers, config){
                    console.log('failed to save user:' + status);
                })
        }
//  clear the add contact form
        $scope.newuser = {};

    };

    $scope.delete = function(id) {
        console.log(id);
        //search user with given id and delete it
        for(var i in $scope.users) {
            if($scope.users[i]._id == id) {
                $scope.newuser._id= id;
                console.log($scope.newuser);
                $http({
                    method:'POST',
                    url: '/deleteUser',
                    data: $scope.newuser
                })
                    .success(function (d, status, headers, config) {
                        console.log('Successful call to db - ' + d);
                    })
                    .error(function(status, headers, config){
                        console.log('failed to delete user:' + status);
                    });
                $scope.users.splice(i,1);
            }
            $scope.newuser = {};
        }

    };
    //clear the add contact form
    $scope.newuser = {};

    $scope.edit = function(id) {
        console.log('user id = '+id);
        //search contact with given id and update it
        for(var i in $scope.users) {
            if($scope.users[i]._id == id) {
                //we use angular.copy() method to create
                //copy of original object
                console.log('id = '+ $scope.users[i]._id);
                $scope.newuser = angular.copy($scope.users[i]);
            }
        }
    };

}]);



//##############################################################
//############## USER Related Controllers  ####################
//##############################################################

//List of users for a coach
function CoachAvailController($scope,$http,$log,adminService) {

    console.log('Getting coach info') ;
    $http({
        method: 'GET',
        url: '/schedule'
    })
        .success(function (data, status, headers, config) {
            console.log((data)) ;
            $scope.timeslots = data;

        });

}

