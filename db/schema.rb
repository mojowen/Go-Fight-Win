# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111213063610) do

  create_table "authentications", :force => true do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "token"
    t.string   "uid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "authentications", ["user_id"], :name => "index_authentications_on_user_id"

  create_table "entries", :force => true do |t|
    t.integer  "item_id"
    t.integer  "field_id"
    t.string   "data"
    t.boolean  "active",     :default => true
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entries", ["field_id"], :name => "index_entries_on_field_id"
  add_index "entries", ["item_id"], :name => "index_entries_on_item_id"

  create_table "fields", :force => true do |t|
    t.string   "field_type",    :default => "text"
    t.string   "name"
    t.integer  "list_id"
    t.text     "field_options"
    t.boolean  "active",        :default => true
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "fields", ["list_id"], :name => "index_fields_on_list_id"
  add_index "fields", ["name", "list_id"], :name => "index_fields_on_name_and_list_id", :unique => true

  create_table "items", :force => true do |t|
    t.integer  "list_id"
    t.boolean  "active",     :default => true
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "items", ["list_id", "id"], :name => "index_items_on_list_id_and_id", :unique => true
  add_index "items", ["list_id"], :name => "index_items_on_list_id"
  add_index "items", ["parent_id"], :name => "index_items_on_parent_id"

  create_table "lists", :force => true do |t|
    t.string   "name"
    t.boolean  "active",     :default => true
    t.string   "fate"
    t.integer  "org_id"
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "operators"
  end

  add_index "lists", ["name", "org_id"], :name => "index_lists_on_name_and_org_id", :unique => true
  add_index "lists", ["org_id"], :name => "index_lists_on_org_id"
  add_index "lists", ["parent_id"], :name => "index_lists_on_parent_id"

  create_table "memberships", :force => true do |t|
    t.integer  "org_id"
    t.integer  "user_id"
    t.boolean  "approved",     :default => false
    t.boolean  "admin",        :default => false
    t.string   "invite_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "memberships", ["invite_token"], :name => "index_memberships_on_invite_token"
  add_index "memberships", ["org_id"], :name => "index_memberships_on_org_id"
  add_index "memberships", ["user_id"], :name => "index_memberships_on_user_id"

  create_table "orgs", :force => true do |t|
    t.boolean  "active"
    t.integer  "parent_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "orgs", ["name"], :name => "index_orgs_on_name"
  add_index "orgs", ["parent_id"], :name => "index_orgs_on_parent_id"

  create_table "users", :force => true do |t|
    t.string   "email",                                 :default => "", :null => false
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "views", :force => true do |t|
    t.string   "name"
    t.string   "slug"
    t.text     "description"
    t.integer  "list_id"
    t.text     "sorts"
    t.text     "groups"
    t.text     "filters"
    t.text     "columns"
    t.boolean  "active",      :default => true
    t.boolean  "public",      :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "visible",     :default => 50
    t.integer  "paged",       :default => 0
    t.string   "goal"
    t.boolean  "groups_on",   :default => false
    t.boolean  "pivot",       :default => false
    t.string   "report_on"
  end

  add_index "views", ["list_id", "name"], :name => "index_views_on_list_id_and_name", :unique => true
  add_index "views", ["list_id"], :name => "index_views_on_list_id"

end
