
function UserDetailsController($scope, $http,$routeParams,$log,wwCoachingService) {
    var path = '';
    path=window.location.pathname;
    /********************************************************
        HACK until i get the Routing in angular fugured out
    ********************************************************/
    $scope.initApp=function(){
        $log.log('initialized');
        
        
        
        wwCoachingService.getUserProfile().then(function () {
            $scope.data = wwCoachingService.userProfile();
            $log.log($scope.data);
            $scope.FirstName = $scope.data.pilotProfile.FirstName;
            $scope.LastName = $scope.data.pilotProfile.LastName;
            $scope._id = $scope.data.pilotProfile._id; 
            $scope.Age = $scope.data.wwProfile.Age; 
            $scope.Gender = $scope.data.wwProfile.Gender; 
            $scope.Height = $scope.data.wwProfile.Height; 
            $scope.Weight = $scope.data.wwProfile.Weight; 
            $scope.MinSafeWeight = $scope.data.wwProfile.MinSafeWeight; 
            $scope.MaxSafeWeight = $scope.data.wwProfile.MaxSafeWeight; 
            
            //call the broadcast method to set the userid globally
            $scope.setPilotUser($scope.data.pilotProfile);
        });
        
      
    };
    
    // $scope.setUserId = function(userid){
    //     console.log('calling set user id with userid = '+ userid);
    //     //broadcast the userid 
    //     wwCoachingService.prepForBroadcast(userid);
            
    // }
    $scope.setPilotUser = function(pilotUser){
        //broadcast the user 
        wwCoachingService.prepForBroadcast(pilotUser);
            
    }
    
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

/***************************************************************
 * Call Notes
 ***************************************************************/
var uid=1;
myApp.controller('NotesController', ['$scope','$http','wwCoachingService', function($scope,$http,wwCoachingService) {
     $scope.initCtrlr=function(){
      
    };
   
    //Handle brodcast of user id
    $scope.$on('handleUserBroadcast', function() {
        $scope.pilotUser = wwCoachingService.PilotUser;
        console.log(wwCoachingService.PilotUser.CallNotes);
        $scope.notes= wwCoachingService.PilotUser.CallNotes;
        if(!$scope.notes){
              $scope.notes = [ ];
        };
        //console.log($scope.notes);
        
    });   
    
    
   $scope.notes = [
        // { id:0, 'date': '12/3/2014 - 11:35 pm', 
        //   'duration': '35 mins',
        //   'note':'went well'
        // }
    ];
    
    
    $scope.savenote = function() {
        console.log($scope.newnote);
        if($scope.newnote.callid == null) {
           
            $scope.newnote.date=$('#pickdatetime').val(); //hack because the ng-model does not bind with datepicker
            $scope.newnote.userid=$scope.pilotUser._id;
            $scope.newnote.callid = $scope.notes.length+1;
            console.log($scope.newnote) ;
            $scope.notes.push($scope.newnote);    
            
            $http({
                method:'POST',
                url: '/addCallNote',
                data: $scope.newnote
            })
            .success(function (d, status, headers, config) {    
                console.log(d);
            })     
            .error(function(status, headers, config){
                console.log('failed to save note:' + status);
            })
            console.log($scope.notes);
        } else {
        
        //for existing contact, find this note using id
        //and update it.
        $scope.newnote.userid=$scope.pilotUser._id;
        for(var i in $scope.notes) {
            if($scope.notes[i].callid == $scope.newnote.callid) {
                //console.log('date = '+ $scope.newnote.date);
                $scope.notes[i] = $scope.newnote;
            }
         }
            console.log($scope.newnote);
            $http({
                method:'POST',
                url: '/updateCallNote',
                data: $scope.newnote
            })
            .success(function (d, status, headers, config) {    
                console.log('Successful call to db - ' + d);
            })     
            .error(function(status, headers, config){
                console.log('failed to save note:' + config);
            })
        }
        /*************************************
        //TO-DO - Save to DB
        ************************************/
        
        //clear the add contact form
        $scope.newnote = {};
    
     };  
     
    $scope.delete = function(id) {
         
        //search note with given id and delete it
        for(var i in $scope.notes) {
            if($scope.notes[i].id == id) {
                $scope.notes.splice(i,1);
                $scope.newnote = {};
            }
        }
         
    };
        //clear the add contact form
        $scope.newnote = {};
    
    $scope.edit = function(id) {
        console.log('note id = '+id);
    //search contact with given id and update it
        for(var i in $scope.notes) {
            if($scope.notes[i].callid == id) {
                //we use angular.copy() method to create 
                //copy of original object
                console.log('id = '+ $scope.notes[i].callid + '  date = '+ $scope.notes[i].date);
                $scope.newnote = angular.copy($scope.notes[i]);
                console.log($scope.newnote.date);
                $('#pickdatetime').val(($scope.notes[i].date));
            }
        }
        
        
        //clear the add contact form
       // $scope.newnote = {};
    };
    
}]);