class CreateLists < ActiveRecord::Migration
  def change
    create_table :lists do |t|
      t.string   "name"
      t.boolean  "active", :default => true
      t.string   "fate"
      t.references  :org
      t.references  :parent

      t.timestamps
    end
    add_index :lists, :org_id
    add_index :lists, :parent_id
    add_index :lists, [:name, :org_id], :unique => true
  end
end
