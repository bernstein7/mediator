class FixOriginFileName < ActiveRecord::Migration
  def change
    Song.all.each do |song|
      song.remote_url.match(/media\/(.*)/)
      song.update(origin_file_name: $1)
    end
  end
end
