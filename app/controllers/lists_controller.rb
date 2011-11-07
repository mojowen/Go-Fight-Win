class ListsController < ApplicationController

  def show
    
    org =  params[:org_id] || params[:org_name]
    
    if /^[-+]?[0-9]+$/ === org
      org = org.to_i
    else 
      org = Org.find_by_slug(org).id
    end
    
    @list = List.find_by_org_and_slug(org, params[:list_name], :include => :items )
    #TODO: Add some sort of paging function when querying rows via a sort
    authorize! :show, @list.org, :message => 'You don\'t have access to that List'
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @list }
    end
  end

end
