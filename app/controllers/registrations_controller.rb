class RegistrationsController < Devise::RegistrationsController
  def create
    super
    session[:omniauth] = nil unless @user.new_record?
    unless session[:invite].nil?
      session[:invite] = nil unless @user.add_invite(session[:invite])
    end
  end
  
  
  private
  
  def build_resource(*args)
    super
    unless params[:invite].nil? && session[:invite].nil?
      invite = params[:invite] || session[:invite]
      @membership = Membership.find_by_invite_token(invite)
      @user.add_invite(invite)
      unless @membership.nil? && @membership.updated_at < 2.weeks.ago
        @memebership = nil
        session[:invite] = params[:invite] if session[:invite].nil?
      end
    end
    if session[:omniauth]
      @user.apply_omniauth(session[:omniauth])
      @user.valid?
    end
  end
  
end
