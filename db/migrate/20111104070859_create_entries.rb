class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.references :item
      t.references :field
      t.string :data
      t.boolean :active, :default => true

      t.timestamps
    end
    add_index :entries, :item_id
    add_index :entries, :field_id
  end
end
