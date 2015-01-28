mediator.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: function() {
          var path = window.location.href.toString().split(window.location.host)[1];
          if(path == '/#/') return '/songs';
        }
      })
      .otherwise({ redirectTo: '/songs'})
}]);
