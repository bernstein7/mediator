class AddOriginFileNameToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :origin_file_name, :string

    Song.all.each do |song|
      song.update(origin_file_name: song.remote_url[28..-1])
    end
  end
end
