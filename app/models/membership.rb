class Membership < ActiveRecord::Base
  belongs_to :org
  belongs_to :user
  
  before_create :make_hash
  
  def make_hash
    if self.approved && self.user_id.nil?
      self.invite_token = SecureRandom.urlsafe_base64
    end
  end
  
end
