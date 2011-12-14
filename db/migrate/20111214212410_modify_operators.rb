class ModifyOperators < ActiveRecord::Migration
  def up
      rename_column :lists, :operators, :operators_old
      add_column :lists, :operators, :text
      remove_column :lists, :operators_old
  end

  def down
  end
end
