function songsResource($resource) {
  return $resource(
    '/songs/:id/:command', {id: '@id'}, {
      update: {method: 'PUT'},
      stream: {method: 'GET', params: {command: "stream"}},
      delete: {method: 'DELETE'}
    });
}