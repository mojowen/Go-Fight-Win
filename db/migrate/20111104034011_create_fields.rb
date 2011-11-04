class CreateFields < ActiveRecord::Migration
  def change
    create_table :fields do |t|
      t.string :field_type, :default => 'text'
      t.string :name
      t.references :list
      t.text :field_options
      t.boolean :active, :default => true

      t.timestamps
    end
    add_index :fields, :list_id
    add_index :fields, [:name, :list_id], :unique => true
    
  end
end
