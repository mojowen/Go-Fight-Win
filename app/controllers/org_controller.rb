class OrgController < ApplicationController
  def index
    @orgs = Org.all
  end

  def show
    @org = Org.find_by_slug(params[:org_name]) unless params[:org_name].nil?
    @org = Org.find(params[:org_id]) unless params[:org_id].nil?
    
    @invites = @org.memberships.select{ |m| m.approved? && m.user_id.nil? }

    authorize! :show, @org, :message => 'You don\'t have access to that Org'
  end


end
