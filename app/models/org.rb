class Org < ActiveRecord::Base
  belongs_to :parent, :class_name => "Org", :foreign_key => 'parent_id'
  has_many :memberships, :dependent => :destroy
  has_many :users, :through => :memberships, :conditions => {:memberships => { :approved => true }}
  
  def parents
    parent = self.parent
    parents = []
    while !parent.nil?
      parents.push(parent)
      parent = parent.parent
    end
    return parents
  end
  
  
  #Stuff for the name field
  before_validation :fix_name
  validates_uniqueness_of :name
  validates_presence_of :name

  def fix_name
    self.name = self.name.split(' ').map {|w| w.capitalize }.join(' ') unless self.name.nil?
  end
  
  def to_param
    self.name.downcase.gsub(' ','_')
  end
  
  def self.find_by_slug(slug)
    self.find_by_name(slug.gsub('_',' ').split(' ').map {|w| w.capitalize }.join(' '))
  end
  
end
