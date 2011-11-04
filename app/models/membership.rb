class Membership < ActiveRecord::Base
  belongs_to :org
  belongs_to :user
  validates_uniqueness_of :user_id, :scope => :org_id
  
  before_create :make_invite_token
  
  def make_invite_token
    if self.approved? && self.user_id.nil?
      self.invite_token = SecureRandom.urlsafe_base64
    end
  end
  
end
