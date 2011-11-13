class CreateViews < ActiveRecord::Migration
  def change
    create_table :views do |t|
      t.string :name
      t.string :slug
      t.text :description

      t.references :list

      t.text :sorts
      t.text :groups
      t.text :filters
      t.text :columns

      
      t.boolean :active, :default => true
      t.boolean :public, :default => false


      t.timestamps
    end
    add_index :views, :list_id
    add_index :views, [:list_id, :name], :unique => true
  end
end
