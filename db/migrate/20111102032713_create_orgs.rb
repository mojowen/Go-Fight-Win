class CreateOrgs < ActiveRecord::Migration
  def change
    create_table :orgs do |t|
      t.boolean :active
      t.references :parent
      t.string :name

      t.timestamps
    end
    add_index :orgs, :parent_id
    add_index :orgs, :name
  end
end
