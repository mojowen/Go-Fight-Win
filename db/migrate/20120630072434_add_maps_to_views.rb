class AddMapsToViews < ActiveRecord::Migration
  def change
    add_column :views, :maps, :text
  end
end
