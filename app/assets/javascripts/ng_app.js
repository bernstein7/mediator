var mediator = angular.module('mediator', ['ngRoute', 'ngResource', 'ngAnimate']);

////////////////////////////////////////////////////////////////////
// Configure HTTP provider to work correctly with forgery protection
////////////////////////////////////////////////////////////////////
mediator.config(["$httpProvider", function(provider) {
  provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  // provider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);
