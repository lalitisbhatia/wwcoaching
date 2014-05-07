// Userlist data array for filling in info box
var coaches = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    
    //getWineList();
    $("#coaches").click(function(){
        console.log('calling get all coaches');
        getAllCoaches();    
    })
    
    // $('#aMyUsers').click(function(){
    //   console.log('My users link clicked') ;
    //   getCoachUsers();
    // });
    
    
});


// Functions =============================================================

// Fill table with data
function getAllCoaches() {
    console.log('inside getAllCoaches');
    jQuery.get('/coaches',function(data,status,xhr){
      console.log(data) ;
      $('#myUsers').html(data);
    
    });
  
};

function getCoachInfo() {
    console.log('inside getCoachInfo');
    jQuery.get('/coach/',function(data,status,xhr){
      console.log(data) ;
      console.dir(data); 
    console.log(status); 
    console.dir(xhr); 
    });
  
};

function getCoachUsers(){
    jQuery.get('/cusers',function(data,status,xhr){
      console.log(data) ;
      $('#myUsers').html(data);
    });
}


// var sampleApp = angular.module('myApp', ['ngRoute']);
 
// sampleApp.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/getuser/:id', {
//     templateUrl: '/partials/user_partial',
//     controller: 'ShowOrderController'
//       });
// }]);
 
 
// sampleApp.controller('ShowOrderController', function($scope, $routeParams) {
 
//     console.log($routeParams.id);
 
// });


angular.module('myApp', ['ngRoute'])
.
config(
  ['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('getuser/:id', {
          templateUrl:'/partials/user_partial',
        controller: UserDetailsController
      })
}]);
    
    
function UserDetailsController($scope, $http,$routeParams) {
    var path = '';
    path=window.location.pathname;
    /********************************************************
        HACK until i get the Routing in angular fugured out
    ********************************************************/
    //console.log(path);
    path =path.replace('getuser','users');
    //console.log(path);
    $http({
            method: 'GET',
            url: path
        })
    .success(function(data, status, headers, config) {
        console.log(data);
      $scope.FirstName = data.FirstName;
      $scope.LastName = data.LastName;
      $scope.Email = data.Email;
      $scope.Phone = data.Phone;
    });
}    
//##############################################################
//############## COACH Related Controllers  ####################
//##############################################################


function CoachController($scope,$http) {

//    var users;
    //$scope.getUsers = function(){ 
        console.log('Getting coach info') ;
        $http({
            method: 'GET',
            url: '/coach'
        })
        .success(function (data, status, headers, config) {    
            console.log((data.FirstName)) ;
            $scope.FirstName = data.FirstName;
            
        });
}
    

//Coach details
// myAppModule.controller('CoachController', ['$scope', '$http',function ($scope,$http) {

// //    var users;
//     //$scope.getUsers = function(){
//         console.log('Getting coach info') ;
//         $http({
//             method: 'GET',
//             url: '/coach'
//         })
//         .success(function (data, status, headers, config) {    
//             console.log((data)) ;
//             $scope.FirstName = data.FirstName;
            
//         });
    
    
//     //};
 
// }]);

//List of users for a coach
function UsersController($scope,$http) {

//    var users;
    //$scope.getUsers = function(){
        console.log('My users link clicked') ;
        $http({
            method: 'GET',
            url: '/cusers'
        })
        .success(function (data, status, headers, config) {    
            //console.log((data)) ;
            $scope.users = data;
            console.log('$scope.users = '+  $scope.users[0]);
        });
    
    
    //};
 
}

// // Coach Schedule related controllers

//##############################################################
//############## USER Related Controllers  ####################
//##############################################################

// //User Details
// myAppModule.controller('UserDetailsController', ['$scope', '$http','$routeParams',function ($scope,$http,$routeParams) {

//         console.log('calling route controller');
//         console.log($routeParams.id);
        
//         // $http({
//         //     method: 'GET',
//         //     url: '/users/'
//         // })
//         // .success(function (data, status, headers, config) {    
//         //     console.log((data)) ;
//         //     $scope.FirstName = data.FirstName;
//         //     //console.log('$scope.users = '+  $scope.users[0]);
//         // });

// }]);
