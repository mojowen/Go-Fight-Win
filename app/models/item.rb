class Item < ActiveRecord::Base
  belongs_to :list
  belongs_to :parent, :class_name => "Item", :foreign_key => 'parent_id'
  
  # Defining entires here to include all fields that are related to this list or any other lists
  has_many :entries, :conditions => ['entries.active =?', true]

  def parents
    parent = self.parent
    parents = []
    parents.push(self)
    until parent.nil? do
      parents.push(parent)
      parent = parent.parent
    end
    return parents
  end
  
  def entries(preload_parents = nil)
    parents = preload_parents.nil? ? self.parents : preload_parents
    @@item = self
    entries = Entry.where('entries.item_id IN(?) AND entries.active =?',parents.map{|i| i.id}, true)
    entries.instance_eval do
      def new(args={})
        args[:item] = @@item
        return Entry.new(args)
      end
    end
    return entries
  end
  
  
end
