class AddVisibleAndPagedtoView < ActiveRecord::Migration
  def up
    add_column :views, :visible, :integer, :default => 50
    add_column :views, :paged, :integer, :default => 0
  end

  def down
  end
end
