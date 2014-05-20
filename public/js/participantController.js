participantModule.controller('ParticipantController', ['$scope','$http','$routeParams','$log','participantService', function($scope,$http,$routeParams,$log,participantService) {
    $scope.initApp=function(){
        //$log.log('participantController initialized');
        var ln = $('#lastname').val();
        var fn = $('#firstname').val();
        $scope.username = '';
        $scope.password='';
        $scope.wwProfile='';
        $scope.firstname=fn;
        $scope.lastname=ln;
        $scope.errMessage='';
        //$('#fakeSave').click();
        //console.log($scope.firstname+' - ' +$scope.lastname);
//        participantService.getUserProfile().then(function () {
//            $scope.data = wwCoachingService.userProfile();
//            $log.log($scope.data);
//            $scope.FirstName = $scope.data.pilotProfile.FirstName;
//            $scope.LastName = $scope.data.pilotProfile.LastName;
//            $scope._id = $scope.data.pilotProfile._id;
//            $scope.Age = $scope.data.wwProfile.Age;
//            $scope.Gender = $scope.data.wwProfile.Gender;
//            $scope.Height = $scope.data.wwProfile.Height;
//            $scope.Weight = $scope.data.wwProfile.Weight;
//            $scope.MinSafeWeight = $scope.data.wwProfile.MinSafeWeight;
//            $scope.MaxSafeWeight = $scope.data.wwProfile.MaxSafeWeight;
//
//            //call the broadcast method to set the userid globally
//            $scope.setPilotUser($scope.data.pilotProfile);
//        });


    };

    $scope.getWWDetails = function(){
        //console.log($scope.username + ' - ' + $scope.password);
        var loginInfo = { "U": $scope.username, "P": $scope.password, "R": "true" };

        var pilotUser = {"firstname":$scope.firstname,"lastname":$scope.lastname};
        //console.log(pilotUser);
        $http({
            method:'POST',
            url: 'https://mobile.weightwatchers.com/authservice.svc/login',
            data: loginInfo
        })
            .success(function (d, status, headers, config) {
                //$log.log(d);
                $scope.wwProfile = d.UserInformation;
                //$log.log($scope.wwProfile);
                //if ww auth is successful, authenticate the pilot profile using the first and last name
                if(d.LoginSuccessful) {
                    $http({
                        method: 'POST',
                        url: '/participant',
                        data: pilotUser
                    })
                        .success(function (d, status, headers, config) {
                            //console.log(d);
                            window.location.replace("/participant/"+$scope.firstname+"/"+$scope.lastname);
                        })
                        .error(function (status, headers, config) {
                            $log.log('failed to get pilot profile:' + status);

                        })
                }else{
                    $scope.errMessage='WW credentials not recognised';
                }
            })
            .error(function(status, headers, config){
                $log.log('failed to get WW profile:' + status);
            })
    }
}]);
