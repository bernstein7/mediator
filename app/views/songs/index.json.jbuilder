json.array!(@songs) do |song|
  json.extract! song, :id, :name, :author, :user_id, :album, :rating
  json.url song_url(song, format: :json)
end
