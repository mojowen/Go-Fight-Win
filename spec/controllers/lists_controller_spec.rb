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
     @rows = '[
         {"key":"new","list":"'+@list.name+'"},
         {"key":"new","list":"'+@list.name+'"},
         {"key":"new","list":"'+@list.name+'"}
    ]'
     before = @list.rows()[:rows].length
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     before.should == @list.rows()[:rows].length - 3
   end
   it 'creates new rows if passed "new" for the row key, also saving the new values' do
     @rows = '[
      {"key":"new","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"a value"},
      {"key":"new","list":"'+@list.name+'","'+@list.fields[2].to_param+'":"a different value"}
     ]'
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     Entry.first.data.should == 'a value'
     Entry.first.field_id.should == @list.fields[0].id
     
     Entry.last.data.should == 'a different value'
     Entry.last.field_id.should == @list.fields[2].id
   end
   it 'updates rows if a key is passed to it' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @list, @list.fields[2].name.to_param => 'old different value' ).save
     
     Row.new(@row1[:key])[ @list.fields[0].to_param ].should == 'old value'
     Row.new(@row2[:key])[ @list.fields[2].to_param ].should == 'old different value'

     @rows = '[
      {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value"},
      {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[2].to_param+'":"new different value"}
     ]'
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json

     Row.new(@row1[:key])[ @list.fields[0].to_param ].should == 'new value'
     Row.new(@row2[:key])[ @list.fields[2].to_param ].should == 'new different value'
   end
   
   it 'saves new grandchild row and creates parent and grandparent items' do
     @rows = '[
      {"key":"new","list":"'+@grandchild.name+'", "'+@list.fields[0].to_param+'":"a value", "'+@grandchild.fields[1].to_param+'":"grandchild value"},
      {"key":"new","list":"'+@grandchild.name+'", "'+@list.fields[2].to_param+'":"a different value", "'+@grandchild.fields[3].to_param+'":"grandchild different value"}
     ]'
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
     @row1 = Row.new( :list => @grandchild, @list.fields[0].name.to_param => 'old value', @grandchild.fields[1].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @grandchild, @list.fields[2].name.to_param => 'old different value', @grandchild.fields[3].name.to_param => 'old different value' ).save
     
     @rows = '[
      {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value", "'+@grandchild.fields[1].to_param+'":"grandchild value"},
      {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[2].to_param+'":"new different value", "'+@grandchild.fields[3].to_param+'":"grandchild different value"}
     ]'
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json

     Row.new(@row1[:key])[ @list.fields[0].to_param ].should == 'new value'
     Row.new(@row1[:key])[ @grandchild.fields[1].to_param ].should == 'grandchild value'
     Row.new(@row2[:key])[ @list.fields[2].to_param ].should == 'new different value'
     Row.new(@row2[:key])[ @grandchild.fields[3].to_param ].should == 'grandchild different value'
   end
   
   it 'saves exact copy and nothing happens' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @list, @list.fields[2].name.to_param => 'old different value' ).save
     
     @row1_updated_at = Item.first.updated_at
     @row2_updated_at = Item.last.updated_at

     @rows = '[
      {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value"},
      {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[2].to_param+'":"old different value"}
     ]'
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     
     Item.first.updated_at == @row1_updated_at
     Item.last.updated_at.should == @row2_updated_at
   end
   
   it 'deletes a row' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save

     @rows = '[
      {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value", "_destroy":"true"}
     ]'

     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     Item.find_by_id(@row1[:key]).should be_nil
   end

   it 'returns success for result for all success' do
     
     @row1 = Row.new( :list => @grandchild, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @grandchild, @list.fields[2].name.to_param => 'old different value' ).save
     
     @rows = '[
      {"key":"new","list":"'+@grandchild.name+'"},
      {"key":"'+@row1[:key].to_s+'","list":"'+@grandchild.name+'","'+@list.fields[0].to_param+'":"old value"},
      {"key":"new","list":"'+@grandchild.name+'"},
      {"key":"'+@row2[:key].to_s+'","list":"'+@grandchild.name+'","'+@list.fields[2].to_param+'":"old different value"}
     ]'
     
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     @response = JSON.parse(response.body)['rows']

     @response.count.should == @grandchild.rows()[:rows].length
     
     @response.each do |r|
       r["success"].should be_true
     end

   end
   it 'saves a non-exsistant row and returns an error' do
     @rows = '[
      {"key":"23","list":"'+@grandchild.name+'","'+@list.fields[0].to_param+'":"old value"},
      {"key":"new","list":"'+@grandchild.name+'","'+@list.fields[0].to_param+'":"old value"}
     ]'
     
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     
     @response = JSON.parse(response.body)['rows']
     @response[0]['success'].should be_false
     @response[1]['success'].should be_true
   end
   it 'saves _tempkeys and it returns new keys and tempkeys' do
     @rows = '[
      {"key":"new","list":"'+@grandchild.name+'","_tempkey":"7"}
     ]'
     
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     
     @response = JSON.parse(response.body)['rows']
     @response[0]['_tempkey'].should == '7'
     @response[0]['key'].should_not be_nil
     
   end
   it 'deletes data if there is empty data passed back' do
     @row1 = Row.new( :list => @grandchild, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @grandchild, @list.fields[2].name.to_param => 'old different value' ).save
     
     @rows = '[
      {"key":"new","list":"'+@grandchild.name+'"},
      {"key":"'+@row1[:key].to_s+'","list":"'+@grandchild.name+'","'+@list.fields[0].to_param+'":""},
      {"key":"new","list":"'+@grandchild.name+'"},
      {"key":"'+@row2[:key].to_s+'","list":"'+@grandchild.name+'","'+@list.fields[2].to_param+'":""}
     ]'
     
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
     
     Row.new(@row1[:key])[@list.fields[0].to_param].should == ''
     Row.new(@row2[:key])[@list.fields[2].to_param].should == ''
     
   end
   it 'deletes some rows, updates some rows, and creates some rows, return data makes sense' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save

     @rows = '[
      {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value"},
      {"key":"new","list":"'+@list.name+'","_tempkey":"7"},
      {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value", "_destroy":"true"}
      ]'
      
      post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :rows => @rows, :format => :json
      
      @response = JSON.parse(response.body)['rows']
      @response[0]['key'].should == @row1[:key]
      Row.new( @row1[:key] )[@list.fields[0].name.to_param ].should == "new value"

      @response[1]['_tempkey'] == '7'
      @response[1]['key'].should_not be_nil
      Item.find_by_id(@response[1]['key']).should_not be_nil
      
      @response[2]['_destroy'].should be_true
      Item.find_by_id(@response[2]['key']).should be_nil
      
   end
   
   it 'saves a new view' do
     @views = '[
      {"name":"a view","id":"new","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]}
     ]'
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :format => :json
     View.last.name.should == 'a view'
     
   end
   it 'updates an existing view' do
     @views = '[
      {"name":"a view","id":"'+@view.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]}
     ]'
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :format => :json
     
     View.find(@view.id).name.should == 'a view'
   end
   it 'deletes a view' do
     @views = '[
     {"name":"a view","id":"'+@view.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[],"_destroy":"true"}
     ]'
     
     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :format => :json
     
     View.find_by_id(@view.id).should be_nil
   end
   
   it 'saves both views and rows, returns correct shit' do
     @row1 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save
     @row2 = Row.new( :list => @list, @list.fields[0].name.to_param => 'old value' ).save

     @rows = '[
      {"key":"'+@row1[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"new value"},
      {"key":"new","list":"'+@list.name+'","_tempkey":"7"},
      {"key":"'+@row2[:key].to_s+'","list":"'+@list.name+'","'+@list.fields[0].to_param+'":"old value", "_destroy":"true"}
      ]'

      @view2 = Factory(:view, :list => @list)
      @view2.save
      
      @views = '[
      {"name":"what view","id":"'+@view.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[],"_destroy":"true"},
      {"name":"diff name view","id":"'+@view2.id.to_s+'","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]},
      {"name":"a view","id":"new","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]}
      ]'
     
      post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :rows => @rows, :format => :json

      @returned = JSON.parse(response.body)
      @response = @returned['rows']
      @response[0]['key'].should == @row1[:key]
      Row.new( @row1[:key] )[@list.fields[0].name.to_param ].should == "new value"

      @response[1]['_tempkey'] == '7'
      @response[1]['key'].should_not be_nil
      Item.find_by_id(@response[1]['key']).should_not be_nil
      
      @response[2]['_destroy'].should be_true
      Item.find_by_id(@response[2]['key']).should be_nil
      
      @response = @returned['views']

      @response[0]['_destroy'].should be_true
      @response[0]['id'].should == @view.id
      View.find_by_id(@response[0]['id']).should be_nil

      @response[1]['name'] == 'diff name view'
      @response[1]['id'].should_not be_nil
      View.find_by_id(@response[1]['id']).should_not be_nil
      
      @response[2]['id'].should == View.last.id
      @response[2]['name'].should == 'a view'
      View.last.name.should == 'a view'
   end
   
   it 'successfully saves some rows even when error' do
     @rows = '[
      {"key":"bad","list":"'+@list.name+'"},
      {"key":"new","list":"'+@list.name+'","_tempkey":"7"}
      ]'
      @views = '[
        {"name":"diff name view","id":"new","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[]},
        {"name":"what view","id":"bad","visible":50,"paged":0,"report_on":{},"pivot":false,"groups_on":false,"goal":{"value":"50"},"groups":[],"sorts":[],"filters":[],"_destroy":"true"}
      ]'
      post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :rows => @rows, :format => :json
      @returned = JSON.parse(response.body)
      
      @returned['rows'][0]['success'].should be_false
      @returned['rows'][0]['key'].should == 'bad'
      @returned['rows'][1]['success'].should be_true
      
      @returned['views'][1]['success'].should be_false
      @returned['views'][1]['id'].should == 'bad'
      @returned['views'][0]['success'].should be_true
   end
   it 'returns errors when passed bad JSON' do

     @rows = 'asdfasda//qw""'
     @views = '[]]]'

     post 'update',  :org_name => @org.to_param, :list_name => @list.to_param, :views => @views, :rows => @rows, :format => :json
     @returned = JSON.parse(response.body)

     @returned['rows']['success'].should be_false
     @returned['views']['success'].should be_false
     
   end
   
 end

end
