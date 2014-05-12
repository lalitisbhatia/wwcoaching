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