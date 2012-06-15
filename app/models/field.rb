class Field < ActiveRecord::Base
  belongs_to :list
  
  before_validation :fix_name
  validates_uniqueness_of :name, :scope => :list_id  
  validates_presence_of :name, :list_id, :field_type
  
  def fix_name
    self.name = self.name.split(' ').map {|w| w.downcase }.join(' ') unless self.name.nil?
  end
  
  def to_param
    self.name.gsub(' ','_')
  end
  
  serialize :field_options
  
end
