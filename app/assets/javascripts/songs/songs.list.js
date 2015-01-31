mediator.controller('SongsCtrl', ['$scope', '$location', '$rootScope', 'songsStorage', '$q', function SongsCtrl($scope, $location, $rootScope, songsStorage, $q) {
  $scope.songs = songsStorage.all(function(){
    _initiateAudios();
  });

  $scope.volume = 70;
  $scope.progress = 70;
  $scope.currentSong = {volume: $scope.volume, audio: {currentTime: 0, paused: true}, progress: '0'};

  cache = window.applicationCache;

  // songsStorage.stream(function(resp){

  //   $scope.source = "data:audio/mp3;base64," + resp.url;
  //   readFile(resp.url);
  // });

  function readFile(file, callback){
    var byteCharacters = window.atob(file);
    var byteNumbers = new Array(byteCharacters.length);
    
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);
    
    var blob = new Blob([byteArray], {type: 'audio/mp3'});

    var reader = new FileReader();
    reader.onload = callback;
    reader.readAsDataURL(blob);
  }

  if (cache) {
      // Добавляем слушателей событий
      // Ресурсы уже кэшированнны. Индикатор прогресса скрыт.
      cache.addEventListener('cached', function(e) {
        debugger;
      }, false);
      // Начало скачивания ресурсов. progress_max - количество ресурсов. Показываем индикатор прогресса
      cache.addEventListener('downloading', function(e) {
        debugger;
        progress_max = 3;
      }, false);
      // Процесс скачивания ресурсов. Индикатор прогресса изменяется
      cache.addEventListener('progress', function(e) {
        debugger;
      }, false);
      // Скачивание ресурсов. Скрываем индикатор прогресса. Обновляем кэш. Перезагружаем страницу.
      cache.addEventListener('updateready', function(e) {
        debugger;
        window.applicationCache.swapCache(); 
        location.reload();
      }, false);
  }

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
      
      songsStorage.stream(song.id, function(resp){
        $scope.source = "data:audio/mp3;base64," + resp.url;
        readFile(resp.url, function(e){
          $scope.currentSong.audio.src = e.target.result;
          $scope.currentSong.audio.play();
        });
      });

      $scope.currentSong.audio.oncanplay = function(audio){
        debugger;
        // audio.target.play();
      }

      $scope.currentSong.audio.addEventListener('loadstart', function() {
        debugger;
        // deferred.resolve(audio);
      });
      
      $scope.currentSong.audio.addEventListener('error', function(e) {
        debugger;
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
      // song.audio.preload = 'none'

      // song.audio.src = "data:audio/mpeg;base64," + song.remote_url;
      // song.audio.src = song.remote_url;
      // // debugger;
      // // song.data = song.remote_url;

      // $scope.test = "data:audio/mp3;base64," + song.remote_url;
      // song.audio.src = "data:audio/mp3;base64," + song.remote_url;
      // song.audio.load();
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