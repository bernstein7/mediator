mediator.controller('SongsCtrl', ['$scope', '$location', '$rootScope', 'songsStorage', '$q', function SongsCtrl($scope, $location, $rootScope, songsStorage, $q) {
  $scope.test = "lolk";
  $scope.songs = songsStorage.all(function(){
    _initiateAudios();
  });

  $scope.volume = 70;
  $scope.progress = 70;
  $scope.currentSong = {volume: $scope.volume, audio: {currentTime: 0, paused: true}, progress: '0'};

  $scope.play = function(song) {
    if ($scope.currentSong == song) {
      $scope.currentSong.audio.play();
    } else {
      
      if ($scope.currentSong.audio.currentTime > 0) {
        $scope.currentSong.audio.currentTime = 0;
        $scope.currentSong.audio.pause();
      }

      $scope.currentSong = song;
      $scope.currentSong.volume = $scope.volume;
      $scope.currentSong.audio.play();

      $scope.currentSong.audio.oncanplay = function(audio){
        // debugger;
        // audio.target.play();
      }

      $scope.currentSong.audio.addEventListener('loadstart', function() {
        debugger;
        // deferred.resolve(audio);
      });
      
      $scope.currentSong.audio.addEventListener('error', function(e) {
        // debugger;
      });
    }
  };

  $scope.pause = function(song) {
    // debugger;
    $scope.currentSong.audio.pause();
  };

  //private

  function _initiateAudios() {
    angular.forEach($scope.songs, function(song) {
      // song.audio = new Audio(song.remote_url);
      song.audio = new Audio();
      song.audio.preload = 'none'

      song.audio.src = song.remote_url;
      // song.audio.src = song.remote_url;
      // // debugger;
      // // song.data = song.remote_url;
    })
  }

  $scope.$watch('volume', function(val){
    if ($scope.currentSong.audio) {
      $scope.currentSong.audio.volume = $scope.volume/100;
    }
  });

  $scope.$watch('currentSong.audio.ended', function(val) {
    if ($scope.currentSong.audio.ended) {
      var nextSong = $scope.songs[$scope.songs.indexOf($scope.currentSong) + 1];
      $scope.play(nextSong ? nextSong : $scope.songs[0]);
    }
  });

  $scope.$watch('currentSong.progress', function(val){
    if ($scope.currentSong.audio && val) {
      $scope.currentSong.audio.currentTime = val * $scope.currentSong.audio.duration;
    }
  });

}]);