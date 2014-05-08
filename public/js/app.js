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
    