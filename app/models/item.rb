class Item < ActiveRecord::Base
  belongs_to :list
  belongs_to :parent, :class_name => "Item", :foreign_key => 'parent_id', :include => :entries
  has_many :entries, :conditions => ['entries.active = ?', true]
end
