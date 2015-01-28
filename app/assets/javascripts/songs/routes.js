mediator.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/songs', {
      templateUrl: '/templates/songs:index',
      controller: 'SongsCtrl'
    })
}]);