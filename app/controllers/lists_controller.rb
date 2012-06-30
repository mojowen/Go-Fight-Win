class ListsController < ApplicationController

  @to_include = [:items, :views]
  
  
  def new
    @org = Org.find(params[:org_id])
    authorize! :manage, @org, :alert => 'NO, you can\'t do that!'
    
    @list = @org.lists.new
    
    respond_to do |format|
      format.html # new.html.erb
    end
    
  end
  
  def create
    @org = Org.find(params[:org_id])
    
    authorize! :manage, @org, :alert => 'NO, you can\'t do that!'
    
    @list = @org.lists.new( params[:list] )
    
    if @list.save
      @msg = 'Yessss list '+@list.name.capitalize+' was created. NOW MAKE SOMETHING OF IT'
      redirect_to list_edit_path( @org.to_param, @list.to_param ), :notice =>  @msg
    else
      @msg = '#fail cause '+@list.errors.map{ |k,v| k.to_s.capitalize+' '+v }.join(',')
      redirect_to list_new_path( @org.id ), :alert =>  @msg
    end
    
  end
  
  def edit
    org = Org.find_by_slug(params[:org_name]).id
    @list = List.find_by_org_and_slug(org, params[:list_name])
    authorize! :manage, @list.org, :alert => 'You don\'t have access to that List'

    @fields = @list.fields
    unless @list.operators.nil?  
      unless @list.operators[:order].nil?
        new_fields = []
        order = @list.operators[:order].class == String ? @list.operators[:order].split(' ') : @list.operators[:order]
        order.each do |o|
          int = o.class == String ? o.to_i : o
          pos = @fields.index{ |f| f.id == int }
          new_fields.push( @fields.slice(pos) ) unless pos.nil?
        end
        @fields = new_fields.concat( @fields.select{ |f| @list.operators[:order].index(f.id).nil? } )
        @fields = @fields.uniq
      end
    end

    respond_to do |format|
      format.html # show.html.erb
    end

  end

  def update_list
    org = Org.find_by_slug(params[:org_name]).id
    @list = List.find_by_org_and_slug(org, params[:list_name])
    authorize! :manage, @list.org, :alert => 'You don\'t have access to that List'

    fields = params[:fields]
    response = { :fields => [], :list => {} }
    
    fields.each do |field_posted|
      field_post = field_posted[1]
      temp_id =  field_post['id'].class == Float ? field_post['id'].to_s.index('new_') : field_post['id'].index('new_')
      
      if temp_id.nil?
        field = @list.fields.find(field_post['id'])
        if field.nil?
          response[:fields].push( {:success => false, :id => field.id, :name => field.name} )
        else
          if field_post['_destroy'].nil?
            success = field.update_attributes(field_post)
            response[:fields].push( {:success => success, :id => field.id, :name => field.name} )
          else
            success = field.delete
            response[:fields].push( {:success => success, :id => field.id, :destroy => true } )
          end
        end
      else
        field = @list.fields.new( field_post )
        success = field.save
        response[:fields].push( {:success => success, :temp_id => field_post['id'], :id => field.id, :name => field.name, :error => field.errors } )
      end
      
    end

    computables = []
    fucked_computables = params['computables']
    fucked_computables.each do |fucked_computable|
      computable = {}
      computable[:field] = fucked_computable[1]['field']
      computable[:operations] = []
      fucked_computable[1]['operations']['0'].each do |fucked_operation|
        operation = {}
        operation[:report] = fucked_operation[1]['report']
        operation[:label] = fucked_operation[1]['label']
        computable[:operations].push(operation )
      end
      computables.push(computable)
    end

    @list.operators = { 
      :order => params['order'], 
      :groupables => params['groupables'], 
      :computables => computables
    }
    response[:list] = {:success => @list.save }
    
    render :json => response, :callback  => params['callback']
    
  end
  
  def show
    
    if params[:list_name].nil?
      @list = List.find(params[:list_id], :include => @to_include )
    else
      org = Org.find_by_slug(params[:org_name]).id
      @list = List.find_by_org_and_slug(org, params[:list_name], :include => @to_include )
    end
    
    authorize! :show, @list.org, :alert => 'You don\'t have access to that List'
    

    @current_view = @list.views.index{|v| v.to_param == params[:view_name] || v.slug == params[:view_slug] }
    @fields = @list.fields
    @query = @list.rows()
    @rows = @query[:rows]
    @size = @query[:size]
    @views = @list.views

    unless @list.operators.nil?  
      unless @list.operators[:order].nil?
        new_fields = []
        order = @list.operators[:order].class == String ? @list.operators[:order].split(' ') : @list.operators[:order]
        order.each do |o|
          int = o.class == String ? o.to_i : o
          pos = @fields.index{ |f| f.id == int }
          new_fields.push( @fields.slice(pos) ) unless pos.nil?
        end
        @fields = new_fields.concat( @fields.select{ |f| @list.operators[:order].index(f.id).nil? } )
        @fields = @fields.uniq
      end
    end
    
    #TODO: Add some sort of paging function when querying rows via a sort
    authorize! :show, @list.org, :alert => 'You don\'t have access to that List'

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @rows }
      format.xls do
          render :xls => @rows,
                         :columns => @fields.map{ |f| f.to_param },
                         :headers => @fields.map{ |f| f.name }
        end
      
    end

  end
  
  def update

    org = Org.find_by_slug(params[:org_name]).id
    @list = List.find_by_org_and_slug(org, params[:list_name], :include => @to_include )
    @rows_results = []
    @views_results = []
    
    authorize! :show, @list.org, :alert => 'You don\'t have access to that List'
    begin
      params[:rows] = params[:rows].class == String ? JSON.parse(params[:rows]) : params[:rows]
      unless params[:rows].nil? || params[:rows].empty? 
          @rows = params[:rows].to_a
          @rows.each do |a|
            r = a[1]
            r[:list] = @list
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
                ['sorts','filters','groups','columns','maps'].each do |array|
                  v[array] = [] if v[array].nil?
                end
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
