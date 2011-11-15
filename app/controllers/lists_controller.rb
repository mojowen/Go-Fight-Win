class ListsController < ApplicationController

  def show
    
    to_include = [:items, :views]

    if params[:list_name].nil?
      @list = List.find(params[:list_id], :include => to_include )
    else
      org = Org.find_by_slug(params[:org_name]).id
      @list = List.find_by_org_and_slug(org, params[:list_name], :include => to_include )
    end
    
    @currentView = @list.views.select{|v| v.name.to_param == params[:view_name] || v.slug == params[:view_slug] }.first
    @fields = @list.fields
    @rows = @list.rows()
    @views = @list.views

    #TODO: Add some sort of paging function when querying rows via a sort
    authorize! :show, @list.org, :message => 'You don\'t have access to that List'

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @list }
    end

  end

end
