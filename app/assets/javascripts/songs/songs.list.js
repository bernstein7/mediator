mediator.controller('SongsCtrl', ['$scope', '$location', '$rootScope', 'songsStorage', '$q', '$interval', function SongsCtrl($scope, $location, $rootScope, songsStorage, $q, $interval) {
  
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var fs = null;
  var context = new AudioContext();
  $scope.analyser = context.createAnalyser();
  
  $scope.songs = songsStorage.all(function(){
    _initiateAudios();
  });

  $scope.startOffset = 0;
  $scope.startTime = 0;
  $scope.volume = 70;
  $scope.progress = 70;
  $scope.defaultBuffer = null;
  $scope.currentSong = {volume: $scope.volume, audio: {currentTime: 0, paused: true}, progress: '0'};

  (function initFS() {
    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(filesystem) {
      fs = filesystem;
    }, errorHandler);
  }());

  // songsStorage.stream(function(resp){

  //   $scope.source = "data:audio/mp3;base64," + resp.url;
  //   readFile(resp.url);
  // });

  // var context;
  // window.addEventListener('load', init, false);
  // function init() {
  //   try {
  //     // Fix up for prefixing
  //     window.AudioContext = window.AudioContext||window.webkitAudioContext;
  //     context = new AudioContext();
  //   }
  //   catch(e) {
  //     alert('Web Audio API is not supported in this browser');
  //   }
  // }
  function dumpAudio(audio, buffer) {
    fs.root.getFile('lol.mp3', {create: true, exclusive: true}, function(fileEntry) {

      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function(fileWriter) {
                
        fileWriter.onwriteend = function(e) {
          console.log('Write completed.');
        };

        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };

        // Create a new Blob and write it to log.txt.
        var blob = new Blob([buffer], {type:'media/mp3'});
        fileWriter.write(blob);

      }, errorHandler);

    }, errorHandler);

    // fs.root.getFile('log.txt', {}, function(fileEntry) {

    //   // Get a File object representing the file,
    //   // then use FileReader to read its contents.
    //   fileEntry.file(function(file) {
    //      var reader = new FileReader();

    //      reader.onloadend = function(e) {
    //        var value = this.result;
    //        alert(value);
    //      };

    //      reader.readAsText(file);
    //   }, errorHandler);

    // }, errorHandler);
  }

  function errorHandler(e) {
    var msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };

    console.log('Error: ' + msg);
  }

  function loadSound(url) {
    var request = new XMLHttpRequest();
    var defer = $q.defer();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {

      context.decodeAudioData(request.response, function(buffer) {
        defer.resolve(buffer);
      });
    }
    request.send();
    return defer.promise;
  }

  function playSound(buffer, time) {
    time = typeof time !== 'undefined' ? time : 0;
    $scope.startTime = context.currentTime;
    $scope.currentSong.source = context.createBufferSource(); // creates a sound source
    $scope.currentSong.source.buffer = buffer;                    // tell the source which sound to play
    $scope.currentSong.source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    $scope.currentSong.source.start(0, time);                           // play the source now
  }

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

  $scope.play = function(song) {

    if ($scope.currentSong == song) {

      playSound($scope.defaultBuffer, song.currentTime);
      $scope.currentSong.paused = false;

    } else {
      
      if ($scope.currentSong.source) {
        $scope.pause();
      }

      $scope.currentSong = song;
      $scope.currentSong.currentTime = 0;

      $scope.currentSong.volume = $scope.volume;
      $scope.currentSong.paused = false;

      loadSound(song.remote_url).then(function(buffer){
        $scope.defaultBuffer = buffer;
        playSound(buffer);
        dumpAudio(song.title, buffer);
      });

      $interval(function() {
        if (!$scope.currentSong.paused){
         $scope.currentSong.currentTime += 0.1;
         // console.log($scope.currentSong.currentTime);
        }
      }, 100);
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