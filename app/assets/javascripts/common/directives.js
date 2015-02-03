mediator.directive('modal', function() {
  return {
    restrict: 'C',
    link: function(scope, element, attr) {

      // open dialog
      if(typeof(scope.$root.openModal) != 'function') {
        scope.$root.openModal = function(id) {
          $('#' + id + '.modal').modal('show');
        }
      }

      // close dialog
      if(typeof(scope.$root.closeModal) != 'function') {
        scope.$root.closeModal = function() {
          $('.modal').modal('hide');
        }
      }
    }
  }
});

mediator.directive('volumeScroll', ['$document', function($document) {
  return {
    restrict: 'A',

    controller: function($scope, $element) {
      $element[0].addEventListener('mousewheel', function(e) {
        e.preventDefault();
        if (e.wheelDelta > 0 && angular.element(this).scope().volume < 100) {
          angular.element(this).scope().volume++;
          angular.element(this).scope().$apply();
        } else if (e.wheelDelta < 0 && angular.element(this).scope().volume > 0) {
          angular.element(this).scope().volume--;
          angular.element(this).scope().$apply();
        }
      });
    }
  }
}]);

mediator.directive('progressBar', ['$document', '$interval', function($document, $interval) {
  return {
    restrict: 'A',
    link: function(scope, element, atts) {
      $interval(function() {
        if (!scope.currentSong.paused && scope.defaultBuffer){
          element.val(scope.currentSong.currentTime / (scope.defaultBuffer.duration));
        }
      }, 25);
    }
  }
}]);