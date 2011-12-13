class View < ActiveRecord::Base
  belongs_to :list
  validates_presence_of :name, :list_id
  validates_uniqueness_of :name, :scope => :list_id
  after_validation :creates_slug
  
  def creates_slug
    self.slug = SecureRandom.urlsafe_base64(3,false)
  end

  def to_param
    self.name.downcase.gsub(' ','_')
  end
  
  
  serialize :sorts
  serialize :groups
  serialize :filters
  serialize :columns
  
  serialize :goal
  serialize :report_on
  
end
