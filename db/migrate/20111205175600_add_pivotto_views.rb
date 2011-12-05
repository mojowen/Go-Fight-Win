class AddPivottoViews < ActiveRecord::Migration
  def up
    add_column :views, :pivot, :boolean, :default => false    
  end

  def down
  end
end
