class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.references :list
      t.boolean :active, :default => true
      t.references :parent

      t.timestamps
    end
    add_index :items, :list_id
    add_index :items, [:list_id, :id], :unique => true
    add_index :items, :parent_id
  end
end
