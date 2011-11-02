class User < ActiveRecord::Base
  # Membership and org stuff
  has_many :memberships, :dependent => :destroy
  has_many :orgs, :through => :memberships, :conditions => {:memberships => { :approved => true }}
  
  
  #Devise stuff
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  attr_accessible :email, :password, :password_confirmation, :remember_me


  # Omniauth stuff
  has_many :authentications, :dependent => :destroy

  def password_required?
    (authentications.empty? || !password.blank?) && super
  end

  def apply_omniauth(omniauth)
    case omniauth['provider']
    when 'facebook'
      self.apply_facebook(omniauth)
    end
    authentications.build(:provider => omniauth['provider'], :uid => omniauth['uid'], :token =>(omniauth['credentials']['token'] rescue nil))
  end

  def facebook
    @fb_user ||= FbGraph::User.me(self.authentications.find_by_provider('facebook').token)
  end

  protected

  def apply_facebook(omniauth)
    if (extra = omniauth['extra']['user_hash'] rescue false)
      self.email = (extra['email'] rescue '')
    end
  end

end
