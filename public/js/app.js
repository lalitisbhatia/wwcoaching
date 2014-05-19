var myApp =angular.module('myApp', ['ngRoute'])
.
config(
  ['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('getuser/:id', {
          templateUrl:'/partials/user_partial',
        controller: UserDetailsController
      })
}]);

var coachingModule = angular.module('coachingModule', ['ngRoute']);
var adminModule = angular.module('adminModule', ['ngRoute']);
var schModule = angular.module('schModule', ['ngRoute']);
var participantModule = angular.module('participantModule', ['ngRoute']);

adminModule.filter('orderObjectBy', function(){
    console.log('inside filter');
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for(var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function(a, b){
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});


