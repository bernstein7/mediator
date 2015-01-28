mediator.controller('NewSongCtrl', ['$scope', '$location', '$rootScope', 'songsStorage',function SongsCtrl($scope, $location, $rootScope, songsStorage) {
  $scope.test = "lolk";
  $scope.list = [{author: 'lol', album: 'look', name: 'what is happening'},
  {author: 'lol', album: 'look', name: 'what is happening'},
  {author: 'lol', album: 'look', name: 'what is happening'}];
  $scope.newSong = {};

  $scope.addSong = function(song) {
    $scope.list.push(song);
    songsStorage.create(song, function(){});
    $scope.closeModal();
    $scope.newSong = {};
  }

}]);