mediator.factory('songsStorage', ['$rootScope', '$resource', '$routeParams', '$interval', function($rootScope, $resource, $routeParams, $interval) {
  var self = this;
  var Song = songsResource($resource);

  self.service = {
    all: function(callback) {
      var songs = [];

      // IF ALREADY CACHED
      // if($rootScope.songs) {
      //   songs = angular.copy($rootScope.songs);
      //   if(typeof callback == 'function') $interval(function() {callback(songs)}, 1, 1);
      //   Song.query(function(response) {
      //     debugger;
      //     $rootScope.songs = angular.copy(songs);
      //     songs = response;
      //   });
      //   return songs;
      // }

      // FETCH FROM SERVER
      songs = Song.query(function(response) {
        $rootScope.songs = angular.copy(songs);
        if(typeof callback == 'function') callback(songs);
      });

      return songs;
    },


    create: function(song, callback) {
      new Song({
        author: song.author,
        album: song.album,
        name: song.name,
        remote_url: song.remote_url
      }).$save(function(response){
        response.isNew = true;
        // debugger;
        $rootScope.songs.unshift(angular.copy(response));
        $rootScope.$emit('songAdded');
        if(typeof callback == 'function') callback(response);
      });
    }
  }

  return self.service;
}]);