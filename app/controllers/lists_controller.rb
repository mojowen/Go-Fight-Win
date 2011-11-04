class ListsController < ApplicationController

  def show
    @list = List.find_by_org_and_slug(params[:org_id] || Org.find_by_slug(params[:org_name]).id, params[:list_name], :include => [:fields, :items] )
    authorize! :show, @list.org, :message => 'You don\'t have access to that List'
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @list }
    end
  end

end
