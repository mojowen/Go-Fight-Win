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
  end
  
  describe "GET 'show' with org name and list name when authenticated" do
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
  
  describe "GET 'show' with org id when not logged in" do
    before :each do
      get 'show', :org_id => @org.id, :list_name => @list.to_param
    end
    it 'should redirect to root' do
      response.should redirect_to(root_url)
    end
  end
  

  
end
