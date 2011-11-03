require 'spec_helper'

describe OrgController do
  
  describe "GET 'index'" do
    before :each do
      @org = Factory(:org)
      @org.save
    end
    
    it 'responds successfully' do
      response.should be_success
    end
    
    it 'responds wiht the orgs' do
      should assigns(@org)
    end
  end

  describe "GET 'show'" do
    before :each do
      @org = Factory(:org)
      @org.save
      login_user(@org)
    end
    
    describe "visiting an org discretely" do
      before :each do
        get 'show', :org_id => @org.id
      end
      it 'should respond with success' do
        response.should be_success
      end
      it 'should respond with correct org' do
        assigns(:org).should.equal? @org
      end
    end
    
    describe 'visits an org at it\'s base ' do
      before :each do
        get 'show', :org_name => @org.to_param
      end
      it 'should be success' do
        response.should be_success
      end
      it 'should return the correct org' do
        assigns(:org).should.equal? @org
      end
    end
  end  

end
