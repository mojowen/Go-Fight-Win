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
  
  def grab_children(list_children)
    children = Item.find_all_by_parent_id(self.id)
    returning = []
    
    unless children.empty?
      
      children.each do |i|
        obj = {}
        obj[:name] = i.list.name
        list = list_children.nil? ? i.list : list_children.select{|l| l == i.list }[0]
        org = list.nil? ? nil : list.org
        org_param = org.nil? ? '' : '/'+org.to_param
        obj[:address] = org_param+'/'+i.list.to_param
        returning.push(obj)
      end

    end
    
    return returning


  end
  
end
