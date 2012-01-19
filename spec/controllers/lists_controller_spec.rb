require 'spec_helper'


describe ListsController do
  before :each do
    @org = Factory(:org)
    @org.save
    @list = Factory(:list, :org => @org )
    @list.save
    @view = Factory(:view, :list => @list)
    @view.save
  end
  
  describe "GET 'show' with org id when logged in" do
    before :each do
      login_user(@org)
      get 'show', :org_name => @org.to_param, :list_name => @list.to_param
    end
    it 'responds successfully' do
      response.should be_success
    end
    it 'responds wiht the orgs' do
      should assigns(@list)
    end
  end
  
  describe "GET 'show' with org name and list name when authenticated" do
    before :each do
      login_user(@org)
      get 'show', :org_name => @org.to_param, :list_name => @list.to_param
    end
    it 'responds successfully' do
      response.should be_success
    end
    it 'responds with the orgs' do
      should assigns(@list)
    end
    it 'matches the route' do
      list_path(@org.to_param, @list.to_param) == '/'+@org.to_param+'/'+@list.to_param
    end
  end
  
  describe "GET 'show' with org id when not logged in" do
    before :each do
      get 'show', :org_name => @org.to_param, :list_name => @list.to_param
    end
    it 'should redirect to root' do
      response.should redirect_to(root_url)
    end
  end
  
  describe "GET show calls up the fields associated with the list" do 
    it 'should assign all the lists fields' do
      @fields = []
      5.times do
        @fields.push( Factory(:field, :list_id => @list.id) )
      end
      get 'show', :org_name => @org.to_param, :list_name => @list.to_param
      should assigns(@fields)
    end
  end
    
  describe "GET show calls up the items associated with the list" do 
    it 'should assign all the lists items' do
      @items = []
      5.times do
        @items.push( Factory(:item, :list_id => @list.id) )
      end
      get 'show', :org_name => @org.to_param, :list_name => @list.to_param
      should assigns(@items)
    end
  end
 
  describe "GET show calls up the items associated with the list" do 
    it 'should assign all the lists items' do
      @entries = []
      5.times do
        @item = Factory(:item, :list => @list)
        @entries.push( Factory(:entry, :item => @item) )
      end
      get 'show', :org_name => @org.to_param, :list_name => @list.to_param
      should assigns(@entries)
    end
  end
  
  describe 'GET show with a view_slug passed to it' do
    before :each do
      login_user(@org)
      get 'show', :org_id => @org.id, :list_id => @list.id, :view_slug => @view.slug
    end
    it 'responds successfully' do
      response.should be_success
    end
    it 'responds with the view' do
      should assigns(@view)
    end
 end
  describe 'GET show with a view_name passed to it' do
    before :each do
      login_user(@org)
      get 'show', :org_name => @org.to_param, :list_name => @list.to_param, :view_name => @view.to_param
    end
    it 'responds successfully' do
      response.should be_success
    end
    it 'responds with the view' do
      should assigns(@view)
    end
 end
 
 
 describe 'POST update to a list' do
   before :each do
     login_user(@org)
     
     @child = Factory(:list, :parent => @list, :org => @org )
     @grandchild = Factory(:list, :parent => @child, :org => @org )
     fields = []
     items = []
     3.times do
       fields.push(Factory(:field, :list => @grandchild ))
       fields.push(Factory(:field, :list => @child ))
       fields.push(Factory(:field, :list => @list ))
     end
     
     
   end
   it 'returns routes successfully' do
     { :post => "/"+@org.to_param+"/"+@list.to_param+"/update" }.should route_to(
           :controller => "lists",
           :action => "update",
           :org_name => @org.to_param,
           :list_name => @list.to_param
         )
   end
   it 'visiting is a success' do
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :format => :json
     response.response_code.should == 200
   end
   it 'creates new rows if passed "new" for the row key' do
     @rows = '{
      "0": {"key":"new", "list":"'+@list.name+'"},
      "1": {"key":"new", "list":"'+@list.name+'"},
      "2": {"key":"new", "list":"'+@list.name+'"}
    }'
    
     # @rows = '{"0":{"key":"new","list":"'+@list.name+'"}}'
     before = @list.rows()[:rows].length
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     before.should == @list.rows()[:rows].length - 3
   end
   it 'creates new rows if passed "new" for the row key, also saving the new values' do
   
     
      @rows = '{
       "0": {"key":"new","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"a value"},
       "1": {"key":"new","list":"'+@list.name+'","'+@list.fields[2].to_param+'":"a different value"}
     }'
   
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     Entry.first.data.should == 'a value'
     Entry.first.field_id.should == @list.fields[0].id
     
     Entry.last.data.should == 'a different value'
     Entry.last.field_id.should == @list.fields[2].id
   end
   it 'updates rows if a key is passed to it' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @list, @list.fields[2].name.to_param => 2 ).save
     @row3 = Row.new( :list => @list, @list.fields[1].name.to_param => "2001-11-01T08:00:00.000Z" ).save
   
     Row.new(@row1[:key])[ @list.fields[0].to_param ].should == 'old value'
     Row.new(@row2[:key])[ @list.fields[2].to_param ].should == '2'
     Row.new(@row3[:key])[ @list.fields[1].to_param ].should == "2001-11-01T08:00:00.000Z"
     
      @rows = '{
       "0": {"key":"'+@row1[:key].to_s+'", "_menu":"rowMenu" , "list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value"},
       "1": {"key":"'+@row2[:key].to_s+'", "_menu":"rowMenu" , "list":"'+@list.name+'","'+@list.fields[2].to_param+'": 3 },
       "2": {"key":"'+@row3[:key].to_s+'", "_menu":"rowMenu" , "list":"'+@list.name+'","'+@list.fields[1].to_param+'": "2011-11-01T08:00:00.000Z" }
     }'
     
     
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
   
     Row.new(@row1[:key])[ @list.fields[0].to_param ].should == 'new value'
     Row.new(@row2[:key])[ @list.fields[2].to_param ].should == '3'
     Row.new(@row3[:key])[ @list.fields[1].to_param ].should == "2011-11-01T08:00:00.000Z"
   end
     
   it 'saves new grandchild row and creates parent and grandparent items' do
     @rows = '{
      "0": {"key":"new","list":"'+@grandchild.name+'", "'+@list.fields[0].to_param+'":"a value", "'+@grandchild.fields[1].to_param+'":"grandchild value"},
      "1": {"key":"new","list":"'+@grandchild.name+'", "'+@list.fields[2].to_param+'":"a different value", "'+@grandchild.fields[3].to_param+'":"grandchild different value"}
     }'
     post 'update',  :org_name => @org.to_param, :list_name => @grandchild.to_param, :rows => @rows, :format => :json
     
     Item.all.count.should == 6
     first = @grandchild.rows()[:rows].first
     last = @grandchild.rows()[:rows].last
     
     first[@list.fields[0].to_param].should == 'a value'
     first[@grandchild.fields[1].to_param].should == 'grandchild value'
     last[@list.fields[2].to_param].should == 'a different value'
     last[@grandchild.fields[3].to_param].should == 'grandchild different value'
   
   end
   it 'updates grandchild row and updates parent and grandparent items' do
      @row1 = Row.new( :list => @grandchild, @list.fields[0].to_param => 'old value', @grandchild.fields[3].to_param => 'old value' ).save
      @row2 = Row.new( :list => @grandchild, @list.fields[2].to_param => 'old different value', @grandchild.fields[1].to_param => 'old different value' ).save
      
      # in this cae both of the row object's are actually just the save's export NOT row objects
      
      @rows = '{
       "0": {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value", "'+@grandchild.fields[1].to_param+'":"grandchild value"},
       "1": {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[2].to_param+'":"new different value", "'+@grandchild.fields[1].to_param+'":"grandchild different value"}
      }'
      post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
      @response = JSON.parse(response.body)['rows']
         
      Row.new( @row1[:key] ) [ @list.fields[0].to_param ].should == 'new value'
      Row.new( @row1[:key] ) [ @grandchild.fields[1].to_param ].should == 'grandchild value'
   
      Row.new(@row2[:key])[ @list.fields[2].to_param ].should == 'new different value'
      Row.new(@row2[:key])[ @grandchild.fields[1].to_param ].should == 'grandchild different value'
    end
   it 'saves exact copy and nothing happens' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @list, @list.fields[2].name.to_param => 'old different value' ).save
     
     @row1_updated_at = Item.first.updated_at
     @row2_updated_at = Item.last.updated_at
   
     @rows = '{
      "1": {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value"},
      "69": {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[2].to_param+'":"old different value"}
     }'
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     
     Item.first.updated_at == @row1_updated_at
     Item.last.updated_at.should == @row2_updated_at
   end
   
   it 'deletes a row' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
   
     @rows = '{
      "23": {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value", "_destroy":"true"}
     }'
   
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     Item.find_by_id(@row1[:key]).should be_nil
   end

   it 'returns success for result for all success' do
     
     @row1 = Row.new( :list => @grandchild, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @grandchild, @list.fields[2].name.to_param => 'old different value' ).save
     
      @rows = '{
       "0": {"key":"new", "list":"'+@grandchild.name+'"},
       "1": {"key":"new", "list":"'+@grandchild.name+'"},
       "2": {"key":"new", "list":"'+@grandchild.name+'"},
       "3": {"key":"new", "list":"'+@grandchild.name+'"},
       "4": {"key":"new", "list":"'+@grandchild.name+'"},
       "5": {"key":"'+@row2[:key].to_s+'","list":"'+@grandchild.name+'" },
       "6": {"key":"'+@row1[:key].to_s+'","list":"'+@grandchild.name+'" }
     }'
     

     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     @response = JSON.parse(response.body)['rows']
     @response.count.should ==  @list.rows()[:rows].length
     
     @response.each do |r|
       r["success"].should be_true
     end
   
   end
   # it 'saves a non-exsistant row and returns an error' do
   #   @rows = '{
   #    "1": {"key":"23","list":"'+@grandchild.name+'","'+@list.fields[0].to_param+'":"old value"},
   #    "2": {"key":"new","list":"'+@grandchild.name+'","'+@list.fields[0].to_param+'":"old value"}
   #   }'
   #   
   #   post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
   #   
   #   @response = JSON.parse(response.body)['rows']
   #   @response[0]['success'].should be_false
   #   @response[1]['success'].should be_true
   # end
   # it 'saves _tempkeys and it returns new keys and tempkeys' do
   #   @rows = '{
   #    "1": {"key":"new","list":"'+@grandchild.name+'","_tempkey":"7"}
   #   }'
   #   
   #   post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
   #   
   #   @response = JSON.parse(response.body)['rows']
   #   @response[0]['_tempkey'].should == '7'
   #   @response[0]['key'].should_not be_nil
   #   
   # end
   # it 'deletes data if there is empty data passed back' do
   #   @row1 = Row.new( :list => @grandchild, @list.fields[0].name.to_param => 'old value' ).save
   #   @row2 = Row.new( :list => @grandchild, @list.fields[2].name.to_param => 'old different value' ).save
   #   
   #   @rows = '{
   #    "6": {"key":"new","list":"'+@grandchild.name+'"},
   #    "5": {"key":"'+@row1[:key].to_s+'","list":"'+@grandchild.name+'","'+@list.fields[0].to_param+'":""},
   #    "4": {"key":"new","list":"'+@grandchild.name+'"},
   #    "3": {"key":"'+@row2[:key].to_s+'","list":"'+@grandchild.name+'","'+@list.fields[2].to_param+'":""}
   #   }'
   #   
   #   post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
   #   
   #   Row.new(@row1[:key])[@list.fields[0].to_param].should == ''
   #   Row.new(@row2[:key])[@list.fields[2].to_param].should == ''
   #   
   # end
   # it 'deletes some rows, updates some rows, and creates some rows, return data makes sense' do
   #   @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
   #   @row2 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
   # 
   #   @rows = '{
   #    "3": {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value"},
   #    "4": {"key":"new","list":"'+@list.name+'","_tempkey":"7"},
   #    "5": {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value", "_destroy":"true"}
   #    }'
   #    
   #    post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
   #    
   #    @response = JSON.parse(response.body)['rows']
   #    @response[0]['key'].should == @row1[:key]
   #    Row.new( @row1[:key] )[@list.fields[0].name.to_param ].should == "new value"
   # 
   #    @response[1]['_tempkey'] == '7'
   #    @response[1]['key'].should_not be_nil
   #    Item.find_by_id(@response[1]['key']).should_not be_nil
   #    
   #    @response[2]['_destroy'].should be_true
   #    Item.find_by_id(@response[2]['key']).should be_nil
   #    
   # end
   # 
   # it 'saves a new view' do
   #   @views = '{
   #    "4": {"name":"a view","id":"new","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]}
   #   }'
   #   post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :format => :json
   #   View.last.name.should == 'a view'
   #   
   # end
   # it 'updates an existing view' do
   #   @views = '{
   #    "3":{"name":"a view","id":"'+@view.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]}
   #   }'
   #   post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :format => :json
   #   
   #   View.find(@view.id).name.should == 'a view'
   # end
   # it 'deletes a view' do
   #   @views = '{
   #   "3":{"name":"a view","id":"'+@view.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[],"_destroy":"true"}
   #   }'
   #   
   #   post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :format => :json
   #   
   #   View.find_by_id(@view.id).should be_nil
   # end
   # it 'saves both views and rows, returns correct shit' do
   #   @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
   #   @row2 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
   # 
   #   @rows = '{
   #    "5":{"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value"},
   #    "4":{"key":"new","list":"'+@list.name+'","_tempkey":"7"},
   #    "3":{"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value", "_destroy":"true"}
   #    }'
   # 
   #    @view2 = Factory(:view, :list => @list)
   #    @view2.save
   #    
   #    @views = '{
   #    "1":{"name":"what view","id":"'+@view.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[],"_destroy":"true"},
   #    "4":{"name":"diff name view","id":"'+@view2.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]},
   #    "3":{"name":"a view","id":"new","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]}
   #    }'
   #   
   #    post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :rows => @rows, :format => :json
   # 
   #    @returned = JSON.parse(response.body)
   #    @response = @returned['rows']
   #    @response[0]['key'].should == @row1[:key]
   #    Row.new( @row1[:key] )[@list.fields[0].name.to_param ].should == "new value"
   # 
   #    @response[1]['_tempkey'] == '7'
   #    @response[1]['key'].should_not be_nil
   #    Item.find_by_id(@response[1]['key']).should_not be_nil
   #    
   #    @response[2]['_destroy'].should be_true
   #    Item.find_by_id(@response[2]['key']).should be_nil
   #    
   #    @response = @returned['views']
   # 
   #    @response[0]['_destroy'].should be_true
   #    @response[0]['id'].should == @view.id
   #    View.find_by_id(@response[0]['id']).should be_nil
   # 
   #    @response[1]['name'] == 'diff name view'
   #    @response[1]['id'].should_not be_nil
   #    View.find_by_id(@response[1]['id']).should_not be_nil
   #    
   #    @response[2]['id'].should == View.last.id
   #    @response[2]['name'].should == 'a view'
   #    View.last.name.should == 'a view'
   # end
   # 
   # it 'successfully saves some rows even when error' do
   #   @rows = '{
   #    "6":{"key":"bad","list":"'+@list.name+'"},
   #    "4":{"key":"new","list":"'+@list.name+'","_tempkey":"7"}
   #    }'
   #    @views = '{
   #      "5":{"name":"diff name view","id":"new","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]},
   #      "3":{"name":"what view","id":"bad","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[],"_destroy":"true"}
   #    }'
   #    post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :rows => @rows, :format => :json
   #    @returned = JSON.parse(response.body)
   #    
   #    @returned['rows'][0]['success'].should be_false
   #    @returned['rows'][0]['key'].should == 'bad'
   #    @returned['rows'][1]['success'].should be_true
   #    
   #    @returned['views'][1]['success'].should be_false
   #    @returned['views'][1]['id'].should == 'bad'
   #    @returned['views'][0]['success'].should be_true
   # end
   # it 'returns errors when passed bad JSON' do
   # 
   #   @rows = 'asdfasda//qw""'
   #   @views = '[]]]'
   # 
   #   post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :rows => @rows, :format => :json
   #   @returned  = JSON.parse(response.body)
   # 
   #   @returned['rows']['success'].should be_false
   #   @returned['views']['success'].should be_false
   #   
   # end

   
 end

end
