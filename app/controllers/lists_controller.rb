class ListsController < ApplicationController

  @to_include = [:items, :views]
    
  def show
    
    if params[:list_name].nil?
      @list = List.find(params[:list_id], :include => @to_include )
    else
      org = Org.find_by_slug(params[:org_name]).id
      @list = List.find_by_org_and_slug(org, params[:list_name], :include => @to_include )
    end
    
    @current_view = @list.views.index{|v| v.to_param == params[:view_name] || v.slug == params[:view_slug] }
    @fields = @list.fields
    @query = @list.rows()
    @rows = @query[:rows]
    @size = @query[:size]
    @views = @list.views

    #TODO: Add some sort of paging function when querying rows via a sort
    authorize! :show, @list.org, :message => 'You don\'t have access to that List'

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @rows }
    end

  end
  
  def update

    org = Org.find_by_slug(params[:org_name]).id
    @list = List.find_by_org_and_slug(org, params[:list_name], :include => @to_include )
    @rows_results = []
    @views_results = []
    
    authorize! :show, @list.org, :message => 'You don\'t have access to that List'
    begin
      params[:rows] = params[:rows].class == String ? JSON.parse(params[:rows]) : params[:rows]
      unless params[:rows].nil? || params[:rows].empty? 
          @rows = params[:rows].to_a
          @rows.each do |a|
            r = a[1]
            begin
              # TO DO: Add something to authorize each row save, right now could sneak in in data in the row data using different list names
              # IDEAS: pass the authorized org into the save method ? and check the @list.org == @list.org on save to verify no funny business
              @rows_results.push( Row.new(r).save )
            rescue
               @error = {}
               @error[:key] = r['key'] || r[:key]
               @error[:e_data] = r
               @error[:success] = false
               @error[:error] = ['Error on Row save']
               @rows_results.push( @error )
             end
          end
      end
    rescue
      @rows_results = {:success => false, :error => 'Invalid JSON for rows' }
    end 
    
    unless params[:views].nil? || params[:views].empty?
      begin
        params[:views] = params[:views].class == String ? JSON.parse(params[:views]) : params[:views]
        @views = params[:views].to_a

        @views.each do |a|
          v = a[1]
          begin
            unless v['_destroy'].nil?
              @view = View.find_by_id_and_list_id(v['id'], @list.id)
              @view.delete
              @views_results.push( {:id => @view.id, :success => true, :_destroy => true, :name => @view.name } )
            else
              if v['id'] == 'new' || v['id'].nil?
                v['id'] = nil
                @view = @list.views.new(v)
                success = @view.save
              else
                @view = View.find_by_id_and_list_id(v['id'], @list.id)
                success = @view.update_attributes(v)
              end
              @views_results.push( {:id => @view.id, :success => success, :name => @view.name, :slug => @view.slug, :data => @view } )
            end
          rescue
            @error = {}
            @error[:id] = v['id'] || v[:id]
            @error[:e_data] = v
            @error[:success] = false
            @error[:error] = ['Error on View save']
            @views_results.push( @error )
          end
        end
      rescue
        @views_results = {:success => false, :error => 'Invalid JSON for views' }
      end
      
    end
    
    
    respond_to do |format|
      format.json { render json: {:rows => @rows_results, :views => @views_results, :sent => @rows } }
    end

  end


end
