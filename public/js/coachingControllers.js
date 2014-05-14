coachingModule.controller('UserDetailsController', ['$scope','$http','$routeParams','$log','wwCoachingService', function($scope,$http,$routeParams,$log,wwCoachingService) {
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

    $scope.setPilotUser = function(pilotUser){
        //broadcast the user
        wwCoachingService.prepForBroadcast(pilotUser);

    };

    $scope.clearData = function() {
        $scope.data = {};
    };

}]);


//##############################################################
//############## COACH Related Controllers  ####################
//##############################################################

coachingModule.controller('CoachController', ['$scope','$http','$log','wwCoachingService', function($scope,$http,$log,wwCoachingService) {
    console.log('Getting coach info') ;
    $http({
        method: 'GET',
        url: '/coach'
    })
        .success(function (data, status, headers, config) {
            console.log((data.FirstName)) ;
            $scope.coach=data;
            $scope.FirstName = data.FirstName;
            //broadcast the coach
            wwCoachingService.prepCoachBroadcast(data);
        });

}]);


//List of users for a coach
coachingModule.controller('UsersController',['$scope','$http','$log','wwCoachingService', function($scope,$http,$log,wwCoachingService) {
    wwCoachingService.getCoachUsers().then(function () {
        $scope.data = wwCoachingService.coachUsers();
        $log.log($scope.data);
        $scope.users = $scope.data;
    });

}]);



//##############################################################
//############## USER Related Controllers  ####################
//##############################################################

/***************************************************************
 * Call Notes
 ***************************************************************/

coachingModule.controller('NotesController', ['$scope','$http','wwCoachingService', function($scope,$http,wwCoachingService) {
     $scope.initCtrlr=function(){
      $scope.User={};
    };
   
    //Handle brodcast of user id
    $scope.$on('handleUserBroadcast', function() {
        $scope.User = wwCoachingService.PilotUser;
        console.log('handle broadcast');
        console.log($scope.User);
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
        console.log($scope.User);
        if($scope.newnote.callid == null) {
           
            $scope.newnote.date=$('#pickdatetime').val(); //hack because the ng-model does not bind with datepicker
            $scope.newnote.userid=$scope.User._id;
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
            });
            console.log($scope.notes);
        } else {
            $scope.newnote.userid=$scope.User._id;
        //for existing contact, find this contact using id
        //and update it.
        for(var i in $scope.notes) {
            if($scope.notes[i].callid == $scope.newnote.callid) {
                //console.log('date = '+ $scope.newnote.date);
                $scope.notes[i] = $scope.newnote;
            }
         }
            //console.log($scope.newnote);
            $http({
                method:'POST',
                url: '/updateCallNote',
                data: $scope.newnote
            })
            .success(function (d, status, headers, config) {    
                console.log('Successful call to db - ' + d);
            })     
            .error(function(status, headers, config){
                console.log('failed to save note:' + status);
            })
        }

        
        //clear the add contact form
        $scope.newnote = {};
    
     };  
     
    $scope.delete = function(id) {

        //search note with given id and delete it
        for(var i in $scope.notes) {
            if($scope.notes[i].callid == id) {
                $scope.newnote.userid=$scope.User._id
                $scope.newnote.callid= id;

                console.log($scope.newnote);
                $http({
                    method:'POST',
                    url: '/deleteCallNote',
                    data: $scope.newnote
                })
                    .success(function (d, status, headers, config) {
                        console.log('Successful call to db - ' + d);
                    })
                    .error(function(status, headers, config){
                        console.log('failed to save note:' + status);
                 });
                $scope.notes.splice(i,1);
            }
            $scope.newnote = {};
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
    };
    
}]);