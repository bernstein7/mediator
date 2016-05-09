mediator.controller('SongsCtrl', ['$scope', '$location', '$rootScope', 'songsStorage', '$q', '$interval', function SongsCtrl($scope, $location, $rootScope, songsStorage, $q, $interval) {
  var myAudioContext, mySource, myBuffer;

  var indexedDB     = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
      IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
      baseName    = "filesBase",
      storeName     = "filesStore";

  function connectDB(f){
      var request = indexedDB.open(baseName, 1);
      request.onsuccess = function(){
          f(request.result);
      }
      request.onupgradeneeded = function(e){
          e.currentTarget.result.createObjectStore(storeName, { keyPath: "path" });
          connectDB(f);
      }
  }

  function setFile(file){
      connectDB(function(db){
          var request = db.transaction([storeName], "readwrite").objectStore(storeName).put({});
          request.onsuccess = function(){
              return request.result;
          }
      });
  }

  if ('AudioContext' in window) {
    myAudioContext = new AudioContext();
  } else if ('webkitAudioContext' in window) {
    myAudioContext = new webkitAudioContext();
  } else {
    alert('Your browser does not support yet Web Audio API');
  }

  $scope.songs = songsStorage.all(function(){
    _initiateAudios();
  });

  $scope.startOffset = 0;
  $scope.startTime = 0;
  $scope.volume = 70;
  $scope.progress = 70;
  $scope.defaultBuffer = null;
  $scope.currentSong = {volume: $scope.volume, audio: {currentTime: 0, paused: true}, progress: '0'};

  (function (url) {

    songsStorage.stream( 8, function(resp){

      setFile(resp.url);
      var arrayBuff = Base64Binary.decodeArrayBuffer(resp.url);
      myAudioContext.decodeAudioData(arrayBuff, function(audioData) {
        myBuffer = audioData;
      });
    });

  }());

  $scope.play = function(song) {

      mySource = myAudioContext.createBufferSource();
      mySource.buffer = myBuffer;
      mySource.connect(myAudioContext.destination);
      if ('AudioContext' in window) {
        mySource.start(0);
      } else if ('webkitAudioContext' in window) {
        mySource.noteOn(0);
      }

  };

  $scope.pause = function(song) {
    $scope.currentSong.source.stop();
    $scope.currentSong.paused = true;
  };

  //private

  function _initiateAudios() {
    angular.forEach($scope.songs, function(song) {
      song.audio = new Audio();
      song.audio.preload = 'none'
      song.paused = true;
      song.audio.src = song.remote_url;

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
    if ($scope.currentSong && val && $scope.defaultBuffer) {
      $scope.currentSong.source.stop();
      $scope.currentSong.currentTime = val * $scope.defaultBuffer.duration;
      playSound($scope.defaultBuffer, $scope.currentSong.currentTime)
    }
  });

}]);