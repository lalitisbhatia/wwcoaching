
function UserDetailsController($scope, $http,$routeParams,$log,wwCoachingService) {
    var path = '';
    path=window.location.pathname;
    /********************************************************
        HACK until i get the Routing in angular fugured out
    ********************************************************/
    $scope.initApp=function(){
        $log.log('initialized');
        
        //$log.log($scope.getGreeting());
        
        //wwCoachingService.setGreeting('Go to sleep!!!');
        
        //$log.log($scope.getGreeting());
        
        wwCoachingService.getUserProfile().then(function () {
            $scope.data = wwCoachingService.userProfile();
            $log.log($scope.data);
            $scope.FirstName = $scope.data.pilotProfile.FirstName;
            $scope.LastName = $scope.data.pilotProfile.LastName; 
            $scope.Age = $scope.data.wwProfile.Age; 
            $scope.Gender = $scope.data.wwProfile.Gender; 
            $scope.Height = $scope.data.wwProfile.Height; 
            $scope.Weight = $scope.data.wwProfile.Weight; 
            $scope.MinSafeWeight = $scope.data.wwProfile.MinSafeWeight; 
            $scope.MaxSafeWeight = $scope.data.wwProfile.MaxSafeWeight; 
        });
        
       
    };
    
    $scope.clearData = function() {
        $scope.data = {};
    };
   
    $scope.getGreeting = function () { return wwCoachingService.greeting; };
   
    //$scope.profile = function(){ return wwProfileService.getUserProfile()};
    
    // $scope.getProfile = function () { return wwProfileService.getUserProfile().then(function(userProfile) {
    //     $log.log(userProfile);
    // }); }
    
    // path =path.replace('getuser','users');
    // //console.log(path);
    // $http({
    //         method: 'GET',
    //         url: path
    //     })
    // .success(function(data, status, headers, config) {
    //     console.log(data);
        
    //     var pilotProfile = data;
    //     $scope.FirstName=pilotProfile.FirstName;
    //   //once successful, call the WW auth method
      
    //     var loginInfo = { "U": data.Username, "P": data.Password, "R": "true" };
    //     $.ajax({
    //         url: 'https://mobile.weightwatchers.com/authservice.svc/login',
    //         type: "POST",
    //         data: JSON.stringify(loginInfo),
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         contentType: "application/json; charset=utf-8",
    //         dataType: "json",
    //         processData: false,
    //         success: function (data, status, xhr) {    
    //             pilotProfile.UserInformation=data.UserInformation;
    //             console.log(pilotProfile);
                
    //         }
    //     });
      
      
    //     wwProfileController(data.Username,data.Password,function(result){
    //         console.log('logging results from callback');
    //         wwProfile = result.UserInformation;
    //         data.UserInformation = result.UserInformation;
    //         console.log('Age - '+ wwProfile.Age);
    //         console.log('setting scope');
    //         $scope.Age= wwProfile.Age;
    //         console.log($scope);
    //   });
    //   console.log($scope);
    //})
}    
//##############################################################
//############## COACH Related Controllers  ####################
//##############################################################


function CoachController($scope,$http,$log,wwCoachingService) {

//     wwCoachingService.getCoachInfo().then(function () {
//             $scope.data = wwCoachingService.coach();
//              $log.log($scope.data);
             
//             $scope.FirstName = $scope.data.FirstName;
// //            $scope.LastName = $scope.data.pilotProfile.LastName; 
//         });

//    var users;
    
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
    
function CoachController2($scope,$http,$log,wwCoachingService) {

//     wwCoachingService.getCoachInfo().then(function () {
//             $scope.data = wwCoachingService.coach();
//              $log.log($scope.data);
             
//             $scope.FirstName = $scope.data.FirstName;
// //            $scope.LastName = $scope.data.pilotProfile.LastName; 
//         });

// //    var users;
//     //$scope.getUsers = function(){ 
//         console.log('Getting coach info') ;
//         $http({
//             method: 'GET',
//             url: '/coach'
//         })
//         .success(function (data, status, headers, config) {    
//             console.log((data.FirstName)) ;
//             $scope.FirstName = data.FirstName;
            
//         });
}
    


//List of users for a coach
function UsersController($scope,$http,$log,wwCoachingService) {

    wwCoachingService.getCoachUsers().then(function () {
            $scope.data = wwCoachingService.coachUsers();
             $log.log($scope.data);
              $scope.users = $scope.data;
        });

//    var users;
    
        // console.log('My users link clicked') ;
        // $http({
        //     method: 'GET',
        //     url: '/cusers'
        // })
        // .success(function (data, status, headers, config) {    
        //     console.log((data)) ;
        //     $scope.users = data;
        //     //console.log('$scope.users = '+  $scope.users[0]);
        // });
    
 
}



// // Coach Schedule related controllers

//##############################################################
//############## USER Related Controllers  ####################
//##############################################################

//List of users for a coach
function CoachAvailController($scope,$http,$log,wwCoachingService) {

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
