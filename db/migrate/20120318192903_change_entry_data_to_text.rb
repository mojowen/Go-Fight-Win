class ChangeEntryDataToText < ActiveRecord::Migration
  def up
    change_column :entries, :data, :text, :limit => 100000
  end

  def down
  end
end
