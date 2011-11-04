class List < ActiveRecord::Base
  belongs_to :org
  belongs_to :parent, :class_name => "List", :foreign_key => 'parent_id'
  
  
  
  # Name and find paramters and scope
  before_validation :fix_name
  validates_uniqueness_of :name, :scope => :org_id  
  validates_presence_of :name
  
  def to_param
    self.name.downcase.gsub(' ','_')
  end  
  def self.find_by_org_and_slug(org_id, slug, args = {})
    self.find_by_org_id_and_name(org_id, slug.gsub('_',' ').split(' ').map {|w| w.capitalize }.join(' '), args)
  end

  def fix_name
    self.name = self.name.split(' ').map {|w| w.capitalize }.join(' ') unless self.name.nil?
  end
  
  
  # Relationship to field
  has_many :fields, :conditions => ['active = ?', true], :order => "fields.id DESC"
  
  def all_fields
    fields = self.fields
    parent = self.parent
    until parent.nil? do
      fields.concat(parent.fields)
      parent = parent.parent
    end
    return fields
  end
  
end