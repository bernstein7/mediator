var mediator = angular.module('mediator', ['ngRoute', 'ngResource', 'ngAnimate']);

////////////////////////////////////////////////////////////////////
// Configure HTTP provider to work correctly with forgery protection
////////////////////////////////////////////////////////////////////
mediator.config(["$httpProvider", function(provider) {
  provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  // provider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);

mediator.config(["$sceProvider", function($sce) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects.
  $sce.enabled(false);
}]);