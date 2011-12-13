class AddOperatorsToList < ActiveRecord::Migration
  def change
    add_column :lists, :operators, :string
  end
end
