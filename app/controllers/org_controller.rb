class OrgController < ApplicationController
  def index
    @orgs = Org.all
  end

  def show
    @org = Org.find_smart( params[:org_id] || params[:org_name], :include => :memberships )
    @invites = @org.memberships.select{ |m| m.approved? && m.user_id.nil? }

    authorize! :show, @org, :message => 'You don\'t have access to that Org'
  end


end
