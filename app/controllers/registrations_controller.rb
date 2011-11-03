class RegistrationsController < Devise::RegistrationsController
  def create
    super
    session[:omniauth] = nil unless @user.new_record?
    unless session[:invite].nil?
      @membership = Membership.find_by_invite_token(session[:invite])
      session[:invite] = nil unless @user.add_membership(@membership)
    end
  end
  
  
  private
  
  def build_resource(*args)
    super
    if session[:omniauth]
      @user.apply_omniauth(session[:omniauth])
      @user.valid?
    end
  end
  
end
