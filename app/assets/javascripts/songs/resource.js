function songsResource($resource) {
  return $resource(
    '/songs/:id/:command', {id: '@id'}, {
      update: {method: 'PUT'},
      delete: {method: 'DELETE'}
    });
}