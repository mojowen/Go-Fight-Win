class ChangeEntryDataToText < ActiveRecord::Migration
  def up
    change_column :entries, :data, :string, :limit => 1000000
  end

  def down
  end
end
