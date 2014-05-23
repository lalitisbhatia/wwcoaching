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
var coachDashboardModule = angular.module('coachDashboardModule',['ngRoute']);