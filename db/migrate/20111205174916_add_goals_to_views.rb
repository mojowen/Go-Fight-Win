class AddGoalsToViews < ActiveRecord::Migration
  def change
    add_column :views, :goal, :string
    add_column :views, :groups_on, :boolean, :default => false    
  end
end
