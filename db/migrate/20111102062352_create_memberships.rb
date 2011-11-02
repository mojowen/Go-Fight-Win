class CreateMemberships < ActiveRecord::Migration
  def change
    create_table :memberships do |t|
      t.references :org
      t.references :user
      t.boolean :approved, :default => false
      t.boolean :admin, :default => false
      t.string :invite_token

      t.timestamps
    end
    add_index :memberships, :org_id
    add_index :memberships, :user_id
    add_index :memberships, :invite_token
  end
end
