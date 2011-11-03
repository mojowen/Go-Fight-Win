require 'spec_helper'

describe MembershipsController do
  before :each do
    @org = Factory(:org)
    @admin = login_admin(@org)
    @membership = Factory(:membership, :org => @org )
  end
  
  describe "GET 'destroy'" do
    it "returns http success" do
      get 'destroy', :org_id => @org.id, :membership => @membership.id
      response.should redirect_to org_path @org.to_param
    end
  end
  
  describe "GET 'update'" do
    it 'reutrns http success' do
      get 'update', :org_id => @org.id, :membership => @membership.id
      response.should redirect_to org_path @org.to_param
    end
  end


end
