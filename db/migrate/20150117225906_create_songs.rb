class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.string :author
      t.integer :user_id
      t.string :album
      t.float :rating

      t.timestamps null: false
    end
  end
end
