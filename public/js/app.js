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
//participantModule.config(['$routeProvider',
//    function($routeProvider) {
//        $routeProvider.
//            when('/participant/scheduler', {
//                templateUrl: 'participantFirst.jade',
//                controller: 'ParticipantController'
//            }).
//            when('/participant/assessment', {
//                templateUrl: '/assessment.html',
//                controller: 'participantFirst.jade'
//            }).
//            otherwise({
//                redirectTo: '/'
//            });
//    }]);

var coachDashboardModule = angular.module('coachDashboardModule',['ngRoute']);