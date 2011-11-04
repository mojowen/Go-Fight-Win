require 'spec_helper'


describe ListsController do
  before :each do
    @org = Factory(:org)
    @org.save
    @list = Factory(:list, :org => @org )
    @list.save
  end
  
  describe "GET 'show' with org id when logged in" do
    before :each do
      login_user(@org)
      get 'show', :org_id => @org.id, :list_name => @list.to_param
    end
    it 'responds successfully' do
      response.should be_success
    end
    it 'responds wiht the orgs' do
      should assigns(@list)
    end
    it 'matches the route' do
      list_discrete_path(@org.id, @list.to_param) == '/'+@org.id.to_s+'/'+@list.to_param
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
      get 'show', :org_id => @org.id, :list_name => @list.to_param
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
      get 'show', :org_id => @org.id, :list_name => @list.to_param
      should assigns(@fields)
    end
  end
    
  describe "GET show calls up the items associated with the list" do 
    it 'should assign all the lists items' do
      @items = []
      5.times do
        @items.push( Factory(:item, :list_id => @list.id) )
      end
      get 'show', :org_id => @org.id, :list_name => @list.to_param
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
      get 'show', :org_id => @org.id, :list_name => @list.to_param
      should assigns(@entries)
    end
  end
  
end
