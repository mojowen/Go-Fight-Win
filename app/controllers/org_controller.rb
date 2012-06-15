class OrgController < ApplicationController
  def index
    @orgs = Org.all.select{ |o| can? :read, o }
  end

  def show
    @org = Org.find_smart( params[:org_id] || params[:org_name], :include => :memberships )
    @invites = @org.memberships.select{ |m| m.approved? && m.user_id.nil? && !m.invite_token.nil? } unless @org.nil?

    authorize! :show, @org, :alert => 'You don\'t have access to that Org'
  end


end
